import { Metadata } from 'next'
import Link from "next/link"

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAssetCate,
  GetCgAssetCatesValidDocument,
} from "@/graphql/generated/graphql";

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { Button } from '@/components/ui/button';
import { CGAssetClient } from './components/client';

export const metadata: Metadata = {
  title: 'CGアセット',
  openGraph: {
    title: 'CGアセット',
    ...commonMetadataOpenGraph,
  }
}

const CGAssetsPage = async ({
  params
}: {
  params: {}
}) => {

  const retCate: ApolloQueryResult<{
    CGAssetCatesValid: CgAssetCate[]
  }> = await apolloServer()
    .query({
      query: GetCgAssetCatesValidDocument,
    });
  const assetCates = retCate.data.CGAssetCatesValid;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4 lg:space-x-6 mx-6">
            CGアセット一覧
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link href={`/c_g_assets/new`}>
              <Button>アセット追加</Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-row">
          <CGAssetClient assetCates={assetCates} />
        </div>
      </div>
    </div>
  );
};

export default CGAssetsPage;
