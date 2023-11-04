import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  SystemNotice,
  ApplyDownloadPaginator,
  CgAssetPaginator,
  HomeDashboardServerManagerDocument,
  // GetSystemNoticesValidDocument,
  // GetApplyDownloadsNotDoneDocument,
  // GetApplyDownloadsOnlyApplyDocument,
  // GetApplyDownloadsApplyOrApprovalDocument,
  // GetCgAssetsCreatedAllDocument,
} from "@/graphql/generated/graphql";

import { HomeDashboardClientManager } from './client-manager';

interface HomeDashboardServerManagerProps { };

const HomeDashboardServerManager = async ({ }: HomeDashboardServerManagerProps) => {
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
  //       manage_user_id: (session?.user as { userId: string }).userId,
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
  //       manage_user_id: (session?.user as { userId: string }).userId,
  //       first: 100,
  //       page: 1
  //     }
  //   });
  // const dls_OnlyApply = retDlsOnlyApply.data.ApplyDownloadsOnlyApply.data;

  // const retDlsApplyOrApproval: ApolloQueryResult<{
  //   ApplyDownloadsApplyOrApproval: ApplyDownloadPaginator
  // }> = await apolloServer()
  //   .query({
  //     query: GetApplyDownloadsApplyOrApprovalDocument,
  //     variables: {
  //       manage_user_id: (session?.user as { userId: string }).userId,
  //       first: 100,
  //       page: 1
  //     }
  //   });
  // const dls_ApplyOrApproval = retDlsApplyOrApproval.data.ApplyDownloadsApplyOrApproval.data;

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
    ApplyDownloadsApplyOrApproval: ApplyDownloadPaginator
    CGAssetsCreatedAll: CgAssetPaginator
  }> = await apolloServer()
    .query({
      query: HomeDashboardServerManagerDocument,
      variables: {
        manage_user_id: (session?.user as { userId: string }).userId,
        create_user_id: (session?.user as { userId: string }).userId,
        first: 100,
        page: 1
      }
    });
  const systemNotices = ret.data.SystemNoticesValid;
  const dls_NotDone = ret.data.ApplyDownloadsNotDone.data;
  const dls_OnlyApply = ret.data.ApplyDownloadsOnlyApply.data;
  const dls_ApplyOrApproval = ret.data.ApplyDownloadsApplyOrApproval.data;
  const cgAssets = ret.data.CGAssetsCreatedAll.data;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HomeDashboardClientManager
          systemNotices={systemNotices}
          downloadApplies={dls_NotDone}
          applies={dls_OnlyApply}
          approvals={dls_ApplyOrApproval}
          cgAssets={cgAssets}
        />
      </div>
    </div>
  );
};

export default HomeDashboardServerManager;
