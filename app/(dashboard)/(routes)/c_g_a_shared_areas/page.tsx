import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgaSharedArea,
  GetCgaSharedAreasDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { CGASharedAreaClient } from "./components/client";
import { CGASharedAreaColumn } from "./components/columns";

export const metadata: Metadata = {
  title: '公開エリア',
  openGraph: {
    title: '公開エリア',
    ...commonMetadataOpenGraph,
  }
}

const CGASharedAreasPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<{
    CGASharedAreas: {
      data: CgaSharedArea[];
      paginatorInfo: PaginatorInfo;
    }
  }> = await apolloServer()
    .query({
      query: GetCgaSharedAreasDocument,
      variables: {
        first: 999,
        page: 1
      },
      fetchPolicy: 'network-only'
    });
  const CGASharedAreas = ret.data.CGASharedAreas.data;
  const paginatorInfo = ret.data.CGASharedAreas.paginatorInfo;

  const formattedCGASharedAreas: CGASharedAreaColumn[] = CGASharedAreas.map((item) => ({
    id: item.id,
    desc: item.desc,
    valid_flg: (item.valid_flg ? '○' : '-'),
    created_at: format(new Date(item.created_at), 'yyyy/MM/dd HH:ii'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGASharedAreaClient data={formattedCGASharedAreas} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default CGASharedAreasPage;
