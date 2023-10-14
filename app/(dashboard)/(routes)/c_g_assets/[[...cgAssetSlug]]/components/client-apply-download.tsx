import { Metadata } from 'next'

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  CgAsset,
  GetCgAssetDocument,
} from "@/graphql/generated/graphql";

import CGAssetApplyDownloadForm from './page-apply-download/c_g_asset-apply-download-form';
import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { CGAssetPageProps } from './page-slug';

export async function generateMetadata({
  params,
}: {
  params: { cgAssetId: string },
}): Promise<Metadata> {

  const ret: ApolloQueryResult<{
    CGAsset: CgAsset
  }> = await apolloServer()
    .query({
      query: GetCgAssetDocument,
      variables: {
        id: params.cgAssetId
      },
    });
  const CGAsset = ret.data.CGAsset;

  if (CGAsset && CGAsset.asset_id) {
    return {
      title: `ID:${CGAsset.asset_id} ダウンロード申請 | CGアセット`,
      openGraph: {
        title: `ID:${CGAsset.asset_id} ダウンロード申請 | CGアセット`,
        ...commonMetadataOpenGraph,
      }
    };
  }

  return {
    title: 'ダウンロード申請 | CGアセット',
    openGraph: {
      title: 'ダウンロード申請 | CGアセット',
      ...commonMetadataOpenGraph,
    }
  }
}

const CGAssetApplyDownloadClient: React.FC<CGAssetPageProps> = async ({ params }) => {

  const ret: ApolloQueryResult<{
    CGAsset: CgAsset
  }> = await apolloServer()
    .query({
      query: GetCgAssetDocument,
      variables: {
        id: params.cgAssetSlug[0]
      },
    });
  const CGAsset = ret.data.CGAsset;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAssetApplyDownloadForm
          initialData={CGAsset}
        />
      </div>
    </div>
  );
}

export default CGAssetApplyDownloadClient;
