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
  CgAssetSearchTag,
  CgAssetSearchAppProd,
} from "@/graphql/generated/graphql";

import { CGAssetPageProps, CGAssetPageSlug } from './components/page-slug';
import { CGAssetSearchClient } from './components/client-search';
import { generateMetadata as generateMetadataFunc } from './components/metadata';
import { isServerRoleAdmin, isServerRoleManager } from '@/lib/check-role-server';

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
  const assetSearchTags = ret.data.CGAssetSearchTagsValid as CgAssetSearchTag[];
  const assetSearchAppProds = ret.data.CGAssetSearchAppProdsValid as CgAssetSearchAppProd[];

  return (
    <CGAssetSearchClient
      assetCates={assetCates}
      assetSearchTags={assetSearchTags}
      assetSearchAppProds={assetSearchAppProds}
    />
  );
}

export default CGAssetPage;
