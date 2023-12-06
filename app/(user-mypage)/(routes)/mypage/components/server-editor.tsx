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
import { ROW_COUNT } from "@/lib/pagenation";
import paginateStyles from "@/styles/components/paginate-block.module.scss";

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
  const dls_NotDone = ret.data.ApplyDownloadsNotDone.data as ApplyDownload[];
  const dls_NotDone_pginfo = ret.data.ApplyDownloadsNotDone.paginatorInfo as PaginatorInfo;
  const dls_OnlyApply = ret.data.ApplyDownloadsOnlyApply.data as ApplyDownload[];
  const dls_OnlyApply_pginfo = ret.data.ApplyDownloadsOnlyApply.paginatorInfo as PaginatorInfo;
  const dls_ApplyOrApproval = ret.data.ApplyDownloadsApplyOrApproval.data as ApplyDownload[];
  const dls_ApplyOrApproval_pginfo = ret.data.ApplyDownloadsApplyOrApproval.paginatorInfo as PaginatorInfo;
  const cgAssets = ret.data.CGAssetsCreatedAll.data as CgAsset[];
  const cgAssets_pginfo = ret.data.CGAssetsCreatedAll.paginatorInfo as PaginatorInfo;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HomeDashboardClientEditor
          systemNotices={systemNotices}
          downloadApplies={dls_NotDone}
          downloadAppliesPg={dls_NotDone_pginfo}
          applies={dls_OnlyApply}
          appliesPg={dls_OnlyApply_pginfo}
          approvals={dls_ApplyOrApproval}
          approvalsPg={dls_ApplyOrApproval_pginfo}
          cgAssets={cgAssets}
          cgAssetsPg={cgAssets_pginfo}
        />
      </div>
    </div>
  );
};

export default HomeDashboardServerEditor;
