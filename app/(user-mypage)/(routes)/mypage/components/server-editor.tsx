import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  HomeDashboardServerEditorQuery,
  HomeDashboardServerEditorDocument,
  SystemNotice,
  ApplyDownload,
  CgAsset,
  PaginatorInfo,
  CgAssetsSearchSection,
} from "@/graphql/generated/graphql";
import { MyPagenator } from "@/components/ui/pagenator";
import { ROW_COUNT } from "@/lib/pagenation";

import { HomeDashboardClientEditor } from './client-editor';

interface HomeDashboardServerEditorProps { };

const HomeDashboardServerEditor = async ({ }: HomeDashboardServerEditorProps) => {
  const session: Session | null = await getServerSession(authOptions)
  const rowCount = ROW_COUNT;

  const ret: ApolloQueryResult<HomeDashboardServerEditorQuery>
    = await apolloServer()
      .query({
        query: HomeDashboardServerEditorDocument,
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
  const dls_OnlyApply = ret.data.ApplyDownloadsOnlyApply.data as ApplyDownload[];
  const dls_OnlyApply_pginfo = ret.data.ApplyDownloadsOnlyApply.paginatorInfo as PaginatorInfo;
  const dls_ApplyOrApproval = ret.data.ApplyDownloadsApplyOrApproval.data as ApplyDownload[];
  const dls_ApplyOrApproval_pginfo = ret.data.ApplyDownloadsApplyOrApproval.paginatorInfo as PaginatorInfo;
  const cgAssets = ret.data.CGAssetsCreatedAll.data as CgAsset[];
  const cgAssets_pginfo = ret.data.CGAssetsCreatedAll.paginatorInfo as PaginatorInfo;

  return (
    <HomeDashboardClientEditor
      systemNotices={systemNotices}
      downloadApplies={dls_WithDone}
      downloadAppliesPg={dls_WithDone_pginfo}
      applies={dls_OnlyApply}
      appliesPg={dls_OnlyApply_pginfo}
      approvals={dls_ApplyOrApproval}
      approvalsPg={dls_ApplyOrApproval_pginfo}
      cgAssets={cgAssets}
      cgAssetsPg={cgAssets_pginfo}
    />
  );
};

export default HomeDashboardServerEditor;
