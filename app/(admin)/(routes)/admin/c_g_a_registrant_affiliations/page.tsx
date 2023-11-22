import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetCgaRegistrantAffiliationsQuery,
  GetCgaRegistrantAffiliationsDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

// import { formatter } from "@/lib/utils";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { CGARegistrantAffiliationClient } from "./components/client";
import { CGARegistrantAffiliationColumn } from "./components/columns";

export const metadata: Metadata = {
  title: '登録者所属',
  openGraph: {
    title: '登録者所属',
    ...commonMetadataOpenGraph,
  }
}

const CGARegistrantAffiliationsPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<GetCgaRegistrantAffiliationsQuery>
    = await apolloServer()
      .query({
        query: GetCgaRegistrantAffiliationsDocument,
        variables: {
          first: 999,
          page: 1
        },
        fetchPolicy: 'network-only'
      });
  const CGARegistrantAffiliations = ret.data.CGARegistrantAffiliations.data;
  const paginatorInfo = ret.data.CGARegistrantAffiliations.paginatorInfo as PaginatorInfo;

  const formattedCGARegistrantAffiliations: CGARegistrantAffiliationColumn[] = CGARegistrantAffiliations.map((item) => ({
    id: item.id,
    desc: item.desc,
    order: item.order as number,
    valid_flg: (item.valid_flg ? '○' : '-'),
    created_at: format(new Date(item.created_at), 'yyyy/MM/dd HH:ii'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGARegistrantAffiliationClient data={formattedCGARegistrantAffiliations} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default CGARegistrantAffiliationsPage;
