import { Metadata } from 'next'
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  CgAsset,
  GetCgAssetDocument,
  CgAssetCate,
  // GetCgAssetCatesValidDocument,
  CgAssetSearchTag,
  // GetCgAssetSearchTagsValidDocument,
  CgAssetSearchAppProd,
  // GetCgAssetSearchAppProdsValidDocument,
  CgAssetSearchClientDocument,
  CgaViewingRestriction,
  CgAssetDetailClientDocument,
  ApplyDownload,
} from "@/graphql/generated/graphql";

import CGAssetDetailClient from './components/client-detail';
import { CGAssetPageProps, CGAssetPageSlug } from './components/page-slug';
import CGAssetEditClient from './components/client-edit';
import { CGAssetSearchClient } from './components/client-search';
import { generateMetadata as generateMetadataFunc } from './components/metadata';
import { isServerRoleAdmin, isServerRoleManager } from '@/lib/check-role-server';
// import CGAssetApplyDownloadClientManager from './components/client-apply-download-manager';
// import CGAssetApplyDownloadClientAdmin from './components/client-apply-download-admin';
// import CGAssetApplyDownloadClientUser from './components/client-apply-download-user';

export async function generateMetadata({
  params,
}: CGAssetPageProps): Promise<Metadata> {
  return generateMetadataFunc({ params });
}

const CGAssetPage: React.FC<CGAssetPageProps> = async ({ params }) => {
  const session: Session | null = await getServerSession(authOptions)

  if (!params.cgAssetSlug) {

    /* CGアセット一覧 */

    const ret: ApolloQueryResult<{
      CGAssetCatesValid: CgAssetCate[]
      CGAssetSearchTagsValid: CgAssetSearchTag[]
      CGAssetSearchAppProdsValid: CgAssetSearchAppProd[]
    }> = await apolloServer()
      .query({
        query: CgAssetSearchClientDocument,
      });
    const assetCates = ret.data.CGAssetCatesValid;
    const assetSearchTags = ret.data.CGAssetSearchTagsValid;
    const assetSearchAppProds = ret.data.CGAssetSearchAppProdsValid;

    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CGAssetSearchClient
            assetCates={assetCates}
            assetSearchTags={assetSearchTags}
            assetSearchAppProds={assetSearchAppProds}
          />
        </div>
      </div>
    );
  }

  if (
    params.cgAssetSlug[0] &&
    params.cgAssetSlug[0] === CGAssetPageSlug.New
  ) {

    /* CGアセット新規追加 */

    return <CGAssetEditClient params={params} />
  }

  if (
    params.cgAssetSlug[0] &&
    params.cgAssetSlug[1] &&
    params.cgAssetSlug[1] === CGAssetPageSlug.Edit
  ) {

    /* CGアセット編集 */

    return <CGAssetEditClient params={params} />
  }

  if (
    params.cgAssetSlug[0] &&
    params.cgAssetSlug[1] &&
    params.cgAssetSlug[1] === CGAssetPageSlug.ApplyDownload
  ) {

    /* CGアセット申請ダウンロード */

    if (await isServerRoleAdmin()) {
      // return <CGAssetApplyDownloadClientAdmin params={params} />
    }
    if (await isServerRoleManager()) {
      // return <CGAssetApplyDownloadClientManager params={params} />
    }

    // return <CGAssetApplyDownloadClientUser params={params} />
  }

  /* CGアセット詳細 */

  const ret: ApolloQueryResult<{
    CGAsset: CgAsset
    CGAViewingRestrictionsValid: CgaViewingRestriction[]
    ApplyDownloadsBoxDeliverGlacierAll: ApplyDownload[]
  }> = await apolloServer()
    .query({
      query: CgAssetDetailClientDocument,
      variables: {
        id: params.cgAssetSlug[0],
        apply_user_id: (session?.user as { userId: string }).userId,
      },
    });
  const CGAsset = ret.data.CGAsset;
  const CgaViewingRestrictions = ret.data.CGAViewingRestrictionsValid;
  const ApplyDownloads = ret.data.ApplyDownloadsBoxDeliverGlacierAll;

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CGAssetDetailClient
            cgAsset={CGAsset}
            cgaViewingRestrictions={CgaViewingRestrictions}
            applyDownloads={ApplyDownloads}
          />
        </div>
      </div>
    </>
  );
}

export default CGAssetPage;
