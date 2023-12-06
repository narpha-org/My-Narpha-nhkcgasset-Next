import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetCgAssetSearchGenresQuery,
  GetCgAssetSearchGenresDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";

import { CGAssetSearchGenreClient } from "./components/client";
import { CGAssetSearchGenreColumn } from "./components/columns";

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
export const metadata: Metadata = {
  title: 'ジャンル',
  openGraph: {
    title: 'ジャンル',
    ...commonMetadataOpenGraph,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_DOMAIN ?
      `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}` :
      `http://localhost:3000`
  )
}

const CGAssetSearchGenresPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<GetCgAssetSearchGenresQuery>
    = await apolloServer()
      .query({
        query: GetCgAssetSearchGenresDocument,
        variables: {
          first: 999,
          page: 1
        },
        fetchPolicy: 'network-only'
      });
  const CGAssetSearchGenres = ret.data.CGAssetSearchGenres.data;
  const paginatorInfo = ret.data.CGAssetSearchGenres.paginatorInfo as PaginatorInfo;

  const formattedCGAssetSearchGenres: CGAssetSearchGenreColumn[] = CGAssetSearchGenres.map((item) => ({
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
        <CGAssetSearchGenreClient data={formattedCGAssetSearchGenres} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default CGAssetSearchGenresPage;
