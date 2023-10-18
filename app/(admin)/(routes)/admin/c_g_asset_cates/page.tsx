import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAssetCate,
  GetCgAssetCatesDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";

import { CGAssetCateClient } from "./components/client";
import { CGAssetCateColumn } from "./components/columns";

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
export const metadata: Metadata = {
  title: 'アセット種別',
  openGraph: {
    title: 'アセット種別',
    ...commonMetadataOpenGraph,
  }
}

const CGAssetCatesPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<{
    CGAssetCates: {
      data: CgAssetCate[];
      paginatorInfo: PaginatorInfo;
    }
  }> = await apolloServer()
    .query({
      query: GetCgAssetCatesDocument,
      variables: {
        first: 999,
        page: 1
      },
      fetchPolicy: 'network-only'
    });
  const CGAssetCates = ret.data.CGAssetCates.data;
  const paginatorInfo = ret.data.CGAssetCates.paginatorInfo;

  const formattedCGAssetCates: CGAssetCateColumn[] = CGAssetCates.map((item) => ({
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
        <CGAssetCateClient data={formattedCGAssetCates} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default CGAssetCatesPage;
