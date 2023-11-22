import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  HomeDashboardServerAdminQuery,
  HomeDashboardServerAdminDocument,
  SystemNotice,
  ApplyDownload,
  CgAsset,
  PaginatorInfo,
} from "@/graphql/generated/graphql";
import { ROW_COUNT } from "@/lib/pagenation";
import paginateStyles from "@/styles/components/paginate-block.module.scss";

import { HomeDashboardClientAdmin } from './client-admin';

interface HomeDashboardServerAdminProps { };

const HomeDashboardServerAdmin = async ({ }: HomeDashboardServerAdminProps) => {
  const session: Session | null = await getServerSession(authOptions)
  const rowCount = ROW_COUNT;

  const ret: ApolloQueryResult<HomeDashboardServerAdminQuery>
    = await apolloServer()
      .query({
        query: HomeDashboardServerAdminDocument,
        variables: {
          create_user_id: (session?.user as { userId: string }).userId,
          first: rowCount,
          page: 1,
          section: 'CGASSETS_SEARCHED_BY_ADMIN',
        }
      });
  const systemNotices = ret.data.SystemNoticesValid as SystemNotice[];
  const dls_NotDone = ret.data.ApplyDownloadsNotDone.data as ApplyDownload[];
  const dls_NotDone_pginfo = ret.data.ApplyDownloadsNotDone.paginatorInfo as PaginatorInfo;
  const dls_OnlyApply = ret.data.ApplyDownloadsOnlyApply.data as ApplyDownload[];
  const dls_OnlyApply_pginfo = ret.data.ApplyDownloadsOnlyApply.paginatorInfo as PaginatorInfo;
  const dls_ApplyOrApprovalOrBoxDeliver = ret.data.ApplyDownloadsApplyOrApprovalOrBoxDeliver.data as ApplyDownload[];
  const dls_ApplyOrApprovalOrBoxDeliver_pginfo = ret.data.ApplyDownloadsApplyOrApprovalOrBoxDeliver.paginatorInfo as PaginatorInfo;
  const cgAssets = ret.data.CGAssetsCreatedAll.data as CgAsset[];
  const cgAssets_pginfo = ret.data.CGAssetsCreatedAll.paginatorInfo as PaginatorInfo;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HomeDashboardClientAdmin
          systemNotices={systemNotices}
          downloadApplies={dls_NotDone}
          downloadAppliesPg={dls_NotDone_pginfo}
          applies={dls_OnlyApply}
          appliesPg={dls_OnlyApply_pginfo}
          approvals={dls_ApplyOrApprovalOrBoxDeliver}
          approvalsPg={dls_ApplyOrApprovalOrBoxDeliver_pginfo}
          cgAssets={cgAssets}
          cgAssetsPg={cgAssets_pginfo}
        />
      </div>
    </div>
  );
};

export default HomeDashboardServerAdmin;
