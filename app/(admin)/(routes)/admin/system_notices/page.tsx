import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetSystemNoticesDocument,
  SystemNoticePaginator,
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
  }
}

const SystemNoticesPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<{
    SystemNotices: SystemNoticePaginator
  }> = await apolloServer()
    .query({
      query: GetSystemNoticesDocument,
      variables: {
        first: 999,
        page: 1
      },
      fetchPolicy: 'network-only'
    });
  const SystemNotices = ret.data.SystemNotices.data;
  const paginatorInfo = ret.data.SystemNotices.paginatorInfo;

  const formattedSystemNotices: SystemNoticeColumn[] = SystemNotices.map((item) => ({
    id: item.id,
    message: item.message,
    order: item.order as number,
    valid_flg: (item.valid_flg ? '○' : '-'),
    created_at: format(new Date(item.created_at), 'yyyy/MM/dd HH:ii'),
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
