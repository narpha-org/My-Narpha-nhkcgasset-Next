import { Metadata } from 'next'
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  CgAssetSearchClientQuery,
  CgAssetSearchClientDocument,
  CgAssetCate,
  CgAssetSearchGenre,
  CgAssetSearchAppProd,
  // CgAssetDetailClientQuery,
  // CgAssetDetailClientDocument,
  // CgAsset,
  // CgaViewingRestriction,
  // ApplyDownload,
} from "@/graphql/generated/graphql";

import { CGAssetPageProps, CGAssetPageSlug } from '@/app/(user-cgassets)/(routes)/c_g_assets/[[...cgAssetSlug]]/components/page-slug';
import { CGAssetSearchClient } from './components/client-search';
import { generateMetadata as generateMetadataFunc } from './components/metadata';
// import { isServerRoleAdmin, isServerRoleManager } from '@/lib/check-role-server';
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

  /* CGアセット一覧 */

  const ret: ApolloQueryResult<CgAssetSearchClientQuery>
    = await apolloServer()
      .query({
        query: CgAssetSearchClientDocument,
      });
  const assetCates = ret.data.CGAssetCatesValid as CgAssetCate[];
  const assetSearchGenres = ret.data.CGAssetSearchGenresValid as CgAssetSearchGenre[];
  const assetSearchAppProds = ret.data.CGAssetSearchAppProdsValid as CgAssetSearchAppProd[];

  return (
    <CGAssetSearchClient
      assetCates={assetCates}
      assetSearchGenres={assetSearchGenres}
      assetSearchAppProds={assetSearchAppProds}
    />
  );
}

export default CGAssetPage;
