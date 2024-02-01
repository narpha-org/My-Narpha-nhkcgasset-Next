import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  HomeDashboardServerUserQuery,
  HomeDashboardServerUserDocument,
  SystemNotice,
  ApplyDownload,
  CgAsset,
  PaginatorInfo,
  CgAssetsSearchSection,
} from "@/graphql/generated/graphql";
// import { MyPagenator } from "@/components/ui/pagenator";
import { ROW_COUNT } from "@/lib/pagenation";

import { HomeDashboardClientUser } from './client-user';

interface HomeDashboardServerUserProps { };

const HomeDashboardServerUser = async ({ }: HomeDashboardServerUserProps) => {
  const session: Session | null = await getServerSession(authOptions)
  const rowCount = ROW_COUNT;

  const ret: ApolloQueryResult<HomeDashboardServerUserQuery>
    = await apolloServer()
      .query({
        query: HomeDashboardServerUserDocument,
        variables: {
          apply_user_id: (session?.user as { userId: string }).userId,
          create_user_id: (session?.user as { userId: string }).userId,
          first: rowCount,
          page: 1,
          section: CgAssetsSearchSection.CgassetsCreatedByUser
        }
      });
  const systemNotices = ret.data.SystemNoticesValid as SystemNotice[];
  const dls_WithDone = ret.data.ApplyDownloadsWithDone.data as ApplyDownload[];
  const dls_WithDone_pginfo = ret.data.ApplyDownloadsWithDone.paginatorInfo as PaginatorInfo;
  // const dls_OnlyApply = ret.data.ApplyDownloadsOnlyApply.data as ApplyDownload[];
  // const dls_OnlyApply_pginfo = ret.data.ApplyDownloadsOnlyApply.paginatorInfo as PaginatorInfo;
  // const cgAssets = ret.data.CGAssetsCreatedAll.data as CgAsset[];
  // const cgAssets_pginfo = ret.data.CGAssetsCreatedAll.paginatorInfo as PaginatorInfo;

  return (
    <HomeDashboardClientUser
      systemNotices={systemNotices}
      downloadApplies={dls_WithDone}
      downloadAppliesPg={dls_WithDone_pginfo}
    // applies={dls_OnlyApply}
    // appliesPg={dls_OnlyApply_pginfo}
    // approvals={dls_WithDone}
    // approvalsPg={dls_WithDone_pginfo}
    // cgAssets={cgAssets}
    // cgAssetsPg={cgAssets_pginfo}
    />
  );
};

export default HomeDashboardServerUser;
