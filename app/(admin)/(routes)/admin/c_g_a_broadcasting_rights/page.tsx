import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetCgaBroadcastingRightsQuery,
  GetCgaBroadcastingRightsDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { CGaBroadcastingRightClient } from "./components/client";
import { CGaBroadcastingRightColumn } from "./components/columns";

export const metadata: Metadata = {
  title: '放送権利',
  openGraph: {
    title: '放送権利',
    ...commonMetadataOpenGraph,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_DOMAIN ?
      `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}` :
      `http://localhost:3000`
  )
}

const CGaBroadcastingRightsPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<GetCgaBroadcastingRightsQuery>
    = await apolloServer()
      .query({
        query: GetCgaBroadcastingRightsDocument,
        variables: {
          first: 999,
          page: 1
        },
        fetchPolicy: 'network-only'
      });
  const CGaBroadcastingRights = ret.data.CGABroadcastingRights.data;
  const paginatorInfo = ret.data.CGABroadcastingRights.paginatorInfo as PaginatorInfo;

  const formattedCGaBroadcastingRights: CGaBroadcastingRightColumn[] = CGaBroadcastingRights.map((item) => ({
    id: item.id,
    desc: item.desc,
    order: item.order as number,
    valid_flg: (item.valid_flg ? '○' : '-'),
    created_at: format(new Date(item.created_at), 'yyyy/MM/dd HH:ii'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGaBroadcastingRightClient data={formattedCGaBroadcastingRights} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default CGaBroadcastingRightsPage;
