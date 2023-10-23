import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAssetSearchTagPaginator,
  GetCgAssetSearchTagsDocument,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";

import { CGAssetSearchTagClient } from "./components/client";
import { CGAssetSearchTagColumn } from "./components/columns";

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
export const metadata: Metadata = {
  title: 'ジャンル',
  openGraph: {
    title: 'ジャンル',
    ...commonMetadataOpenGraph,
  }
}

const CGAssetSearchTagsPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<{
    CGAssetSearchTags: CgAssetSearchTagPaginator
  }> = await apolloServer()
    .query({
      query: GetCgAssetSearchTagsDocument,
      variables: {
        first: 999,
        page: 1
      },
      fetchPolicy: 'network-only'
    });
  const CGAssetSearchTags = ret.data.CGAssetSearchTags.data;
  const paginatorInfo = ret.data.CGAssetSearchTags.paginatorInfo;

  const formattedCGAssetSearchTags: CGAssetSearchTagColumn[] = CGAssetSearchTags.map((item) => ({
    id: item.id,
    code: item.code,
    desc: item.desc,
    order: item.order as number,
    valid_flg: (item.valid_flg ? '○' : '-'),
    created_at: format(new Date(item.created_at), 'yyyy/MM/dd HH:ii'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAssetSearchTagClient data={formattedCGAssetSearchTags} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default CGAssetSearchTagsPage;
