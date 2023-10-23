import { Metadata } from 'next'
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  SystemNotice,
  GetSystemNoticesValidDocument,
  GetApplyDownloadsNoRemovalDocument,
  GetApplyDownloadsEntryDocument,
  GetApplyDownloadsApprovalDocument,
  ApplyDownloadPaginator,
} from "@/graphql/generated/graphql";

import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getStockCount } from "@/actions/get-stock-count";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { HomeDashboardClient } from './components/client';

export const metadata: Metadata = {
  title: 'NHK CGアセットストア',
  openGraph: {
    title: 'NHK CGアセットストア',
    ...commonMetadataOpenGraph,
  }
}

interface HomeDashboardPageProps {
  params: {
  };
};

const HomeDashboardPage: React.FC<HomeDashboardPageProps> = async ({
  params
}) => {
  const session: Session | null = await getServerSession(authOptions)

  const totalRevenue = await getTotalRevenue();
  const graphRevenue = await getGraphRevenue();
  const salesCount = await getSalesCount();
  const stockCount = await getStockCount();

  const retSystemNotice: ApolloQueryResult<{
    SystemNoticesValid: SystemNotice[]
  }> = await apolloServer()
    .query({
      query: GetSystemNoticesValidDocument,
    });
  const systemNotices = retSystemNotice.data.SystemNoticesValid;

  const retDownloadNoRemoval: ApolloQueryResult<{
    ApplyDownloadsNoRemoval: ApplyDownloadPaginator
  }> = await apolloServer()
    .query({
      query: GetApplyDownloadsNoRemovalDocument,
      variables: {
        user_id: (session?.user as { userId: string }).userId,
        first: 100,
        page: 1
      }
    });
  const downloadNoRemovals = retDownloadNoRemoval.data.ApplyDownloadsNoRemoval.data;

  const retDownloadEntry: ApolloQueryResult<{
    ApplyDownloadsEntry: ApplyDownloadPaginator
  }> = await apolloServer()
    .query({
      query: GetApplyDownloadsEntryDocument,
      variables: {
        user_id: (session?.user as { userId: string }).userId,
        first: 100,
        page: 1
      }
    });
  const downloadEntries = retDownloadEntry.data.ApplyDownloadsEntry.data;

  const retDownloadApproval: ApolloQueryResult<{
    ApplyDownloadsApproval: ApplyDownloadPaginator
  }> = await apolloServer()
    .query({
      query: GetApplyDownloadsApprovalDocument,
      variables: {
        user_id: (session?.user as { userId: string }).userId,
        first: 100,
        page: 1
      }
    });
  const downloadApprovals = retDownloadApproval.data.ApplyDownloadsApproval.data;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HomeDashboardClient
          systemNotices={systemNotices}
          downloadNoRemovals={downloadNoRemovals}
          downloadEntries={downloadEntries}
          downloadApprovals={downloadApprovals}
        />
      </div>
    </div>
  );
};

export default HomeDashboardPage;
