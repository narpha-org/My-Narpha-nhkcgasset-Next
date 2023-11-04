import { Metadata } from 'next'

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

  if (!params.cgAssetSlug) {

    /* CGアセット一覧 */

    // const retCate: ApolloQueryResult<{
    //   CGAssetCatesValid: CgAssetCate[]
    // }> = await apolloServer()
    //   .query({
    //     query: GetCgAssetCatesValidDocument,
    //   });
    // const assetCates = retCate.data.CGAssetCatesValid;

    // const retSearchTag: ApolloQueryResult<{
    //   CGAssetSearchTagsValid: CgAssetSearchTag[]
    // }> = await apolloServer()
    //   .query({
    //     query: GetCgAssetSearchTagsValidDocument,
    //   });
    // const assetSearchTags = retSearchTag.data.CGAssetSearchTagsValid;

    // const retAppProd: ApolloQueryResult<{
    //   CGAssetSearchAppProdsValid: CgAssetSearchAppProd[]
    // }> = await apolloServer()
    //   .query({
    //     query: GetCgAssetSearchAppProdsValidDocument,
    //   });
    // const assetSearchAppProds = retAppProd.data.CGAssetSearchAppProdsValid;

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
  }> = await apolloServer()
    .query({
      query: CgAssetDetailClientDocument,
      variables: {
        id: params.cgAssetSlug[0]
      },
    });
  const CGAsset = ret.data.CGAsset;
  const CgaViewingRestrictions = ret.data.CGAViewingRestrictionsValid;

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CGAssetDetailClient
            cgAsset={CGAsset}
            cgaViewingRestrictions={CgaViewingRestrictions}
          />
        </div>
      </div>
    </>
  );
}

export default CGAssetPage;
