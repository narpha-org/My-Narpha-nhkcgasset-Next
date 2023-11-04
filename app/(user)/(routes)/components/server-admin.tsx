import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  SystemNotice,
  ApplyDownloadPaginator,
  CgAssetPaginator,
  HomeDashboardServerAdminDocument,
  // GetSystemNoticesValidDocument,
  // GetApplyDownloadsNotDoneDocument,
  // GetApplyDownloadsOnlyApplyDocument,
  // GetApplyDownloadsApplyOrApprovalOrBoxDeliverDocument,
  // GetCgAssetsCreatedAllDocument,
} from "@/graphql/generated/graphql";

import { HomeDashboardClientAdmin } from './client-admin';

interface HomeDashboardServerAdminProps { };

const HomeDashboardServerAdmin = async ({ }: HomeDashboardServerAdminProps) => {
  const session: Session | null = await getServerSession(authOptions)

  // const retSystemNotice: ApolloQueryResult<{
  //   SystemNoticesValid: SystemNotice[]
  // }> = await apolloServer()
  //   .query({
  //     query: GetSystemNoticesValidDocument,
  //   });
  // const systemNotices = retSystemNotice.data.SystemNoticesValid;

  // const retDlsNotDone: ApolloQueryResult<{
  //   ApplyDownloadsNotDone: ApplyDownloadPaginator
  // }> = await apolloServer()
  //   .query({
  //     query: GetApplyDownloadsNotDoneDocument,
  //     variables: {
  //       first: 100,
  //       page: 1
  //     }
  //   });
  // const dls_NotDone = retDlsNotDone.data.ApplyDownloadsNotDone.data;

  // const retDlsOnlyApply: ApolloQueryResult<{
  //   ApplyDownloadsOnlyApply: ApplyDownloadPaginator
  // }> = await apolloServer()
  //   .query({
  //     query: GetApplyDownloadsOnlyApplyDocument,
  //     variables: {
  //       first: 100,
  //       page: 1
  //     }
  //   });
  // const dls_OnlyApply = retDlsOnlyApply.data.ApplyDownloadsOnlyApply.data;

  // const retDlsApplyOrApprovalOrBoxDeliver: ApolloQueryResult<{
  //   ApplyDownloadsApplyOrApprovalOrBoxDeliver: ApplyDownloadPaginator
  // }> = await apolloServer()
  //   .query({
  //     query: GetApplyDownloadsApplyOrApprovalOrBoxDeliverDocument,
  //     variables: {
  //       first: 100,
  //       page: 1
  //     }
  //   });
  // const dls_ApplyOrApprovalOrBoxDeliver = retDlsApplyOrApprovalOrBoxDeliver.data.ApplyDownloadsApplyOrApprovalOrBoxDeliver.data;

  // const retCgAsset: ApolloQueryResult<{
  //   CGAssetsCreatedAll: CgAssetPaginator
  // }> = await apolloServer()
  //   .query({
  //     query: GetCgAssetsCreatedAllDocument,
  //     variables: {
  //       create_user_id: (session?.user as { userId: string }).userId,
  //       first: 100,
  //       page: 1
  //     }
  //   });
  // const cgAssets = retCgAsset.data.CGAssetsCreatedAll.data;

  const ret: ApolloQueryResult<{
    SystemNoticesValid: SystemNotice[]
    ApplyDownloadsNotDone: ApplyDownloadPaginator
    ApplyDownloadsOnlyApply: ApplyDownloadPaginator
    ApplyDownloadsApplyOrApprovalOrBoxDeliver: ApplyDownloadPaginator
    CGAssetsCreatedAll: CgAssetPaginator
  }> = await apolloServer()
    .query({
      query: HomeDashboardServerAdminDocument,
      variables: {
        create_user_id: (session?.user as { userId: string }).userId,
        first: 100,
        page: 1
      }
    });
  const systemNotices = ret.data.SystemNoticesValid;
  const dls_NotDone = ret.data.ApplyDownloadsNotDone.data;
  const dls_OnlyApply = ret.data.ApplyDownloadsOnlyApply.data;
  const dls_ApplyOrApprovalOrBoxDeliver = ret.data.ApplyDownloadsApplyOrApprovalOrBoxDeliver.data;
  const cgAssets = ret.data.CGAssetsCreatedAll.data;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HomeDashboardClientAdmin
          systemNotices={systemNotices}
          downloadApplies={dls_NotDone}
          applies={dls_OnlyApply}
          approvals={dls_ApplyOrApprovalOrBoxDeliver}
          cgAssets={cgAssets}
        />
      </div>
    </div>
  );
};

export default HomeDashboardServerAdmin;
