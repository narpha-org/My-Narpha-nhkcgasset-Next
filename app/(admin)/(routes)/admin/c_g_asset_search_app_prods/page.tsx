import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAssetSearchAppProdPaginator,
  GetCgAssetSearchAppProdsDocument,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";

import { CGAssetSearchAppProdClient } from "./components/client";
import { CGAssetSearchAppProdColumn } from "./components/columns";

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
export const metadata: Metadata = {
  title: '制作ソフトウェア',
  openGraph: {
    title: '制作ソフトウェア',
    ...commonMetadataOpenGraph,
  }
}

const CGAssetSearchAppProdsPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<{
    CGAssetSearchAppProds: CgAssetSearchAppProdPaginator
  }> = await apolloServer()
    .query({
      query: GetCgAssetSearchAppProdsDocument,
      variables: {
        first: 999,
        page: 1
      },
      fetchPolicy: 'network-only'
    });
  const CGAssetSearchAppProds = ret.data.CGAssetSearchAppProds.data;
  const paginatorInfo = ret.data.CGAssetSearchAppProds.paginatorInfo;

  const formattedCGAssetSearchAppProds: CGAssetSearchAppProdColumn[] = CGAssetSearchAppProds.map((item) => ({
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
        <CGAssetSearchAppProdClient data={formattedCGAssetSearchAppProds} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default CGAssetSearchAppProdsPage;
