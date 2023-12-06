import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetSystemNoticesQuery,
  GetSystemNoticesDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";

import { SystemNoticeClient } from "./components/client";
import { SystemNoticeColumn } from "./components/columns";

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
export const metadata: Metadata = {
  title: 'お知らせ',
  openGraph: {
    title: 'お知らせ',
    ...commonMetadataOpenGraph,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_DOMAIN ?
      `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}` :
      `http://localhost:3000`
  )
}

const SystemNoticesPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<GetSystemNoticesQuery>
    = await apolloServer()
      .query({
        query: GetSystemNoticesDocument,
        variables: {
          first: 999,
          page: 1
        },
        fetchPolicy: 'network-only'
      });
  const SystemNotices = ret.data.SystemNotices.data;
  const paginatorInfo = ret.data.SystemNotices.paginatorInfo as PaginatorInfo;

  const formattedSystemNotices: SystemNoticeColumn[] = SystemNotices.map((item) => ({
    id: item.id,
    message: item.message,
    notice_date: item.notice_date,
    valid_flg: (item.valid_flg ? '○' : '-')
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SystemNoticeClient data={formattedSystemNotices} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default SystemNoticesPage;
