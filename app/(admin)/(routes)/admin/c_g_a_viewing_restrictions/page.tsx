import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetCgaViewingRestrictionsQuery,
  GetCgaViewingRestrictionsDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { CGAViewingRestrictionClient } from "./components/client";
import { CGAViewingRestrictionColumn } from "./components/columns";

export const metadata: Metadata = {
  title: '閲覧制限',
  openGraph: {
    title: '閲覧制限',
    ...commonMetadataOpenGraph,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_DOMAIN ?
      `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}` :
      `http://localhost:3000`
  )
}

const CGAViewingRestrictionsPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<GetCgaViewingRestrictionsQuery>
    = await apolloServer()
      .query({
        query: GetCgaViewingRestrictionsDocument,
        variables: {
          first: 999,
          page: 1
        },
        fetchPolicy: 'network-only'
      });
  const CGAViewingRestrictions = ret.data.CGAViewingRestrictions.data;
  const paginatorInfo = ret.data.CGAViewingRestrictions.paginatorInfo as PaginatorInfo;

  const formattedCGAViewingRestrictions: CGAViewingRestrictionColumn[] = CGAViewingRestrictions.map((item) => ({
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
        <CGAViewingRestrictionClient data={formattedCGAViewingRestrictions} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default CGAViewingRestrictionsPage;
