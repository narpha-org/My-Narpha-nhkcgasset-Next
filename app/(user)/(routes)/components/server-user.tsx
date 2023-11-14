import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  SystemNotice,
  ApplyDownloadPaginator,
  CgAssetPaginator,
  HomeDashboardServerUserDocument,
} from "@/graphql/generated/graphql";
import { ROW_COUNT } from "@/lib/pagenation";

import { HomeDashboardClientUser } from './client-user';

interface HomeDashboardServerUserProps { };

const HomeDashboardServerUser = async ({ }: HomeDashboardServerUserProps) => {
  const session: Session | null = await getServerSession(authOptions)
  const rowCount = ROW_COUNT;

  const ret: ApolloQueryResult<{
    SystemNoticesValid: SystemNotice[]
    ApplyDownloadsNotDone: ApplyDownloadPaginator
    ApplyDownloadsOnlyApply: ApplyDownloadPaginator
    CGAssetsCreatedAll: CgAssetPaginator
  }> = await apolloServer()
    .query({
      query: HomeDashboardServerUserDocument,
      variables: {
        user_id: (session?.user as { userId: string }).userId,
        create_user_id: (session?.user as { userId: string }).userId,
        first: rowCount,
        page: 1,
        section: 'CGASSETS_CREATED_BY_USER'
      }
    });
  const systemNotices = ret.data.SystemNoticesValid;
  const dls_NotDone = ret.data.ApplyDownloadsNotDone.data;
  const dls_NotDone_pginfo = ret.data.ApplyDownloadsNotDone.paginatorInfo;
  const dls_OnlyApply = ret.data.ApplyDownloadsOnlyApply.data;
  const dls_OnlyApply_pginfo = ret.data.ApplyDownloadsOnlyApply.paginatorInfo;
  const cgAssets = ret.data.CGAssetsCreatedAll.data;
  const cgAssets_pginfo = ret.data.CGAssetsCreatedAll.paginatorInfo;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HomeDashboardClientUser
          systemNotices={systemNotices}
          downloadApplies={dls_NotDone}
          downloadAppliesPg={dls_NotDone_pginfo}
          applies={dls_OnlyApply}
          appliesPg={dls_OnlyApply_pginfo}
          approvals={dls_NotDone}
          approvalsPg={dls_NotDone_pginfo}
          cgAssets={cgAssets}
          cgAssetsPg={cgAssets_pginfo}
        />
      </div>
    </div>
  );
};

export default HomeDashboardServerUser;
