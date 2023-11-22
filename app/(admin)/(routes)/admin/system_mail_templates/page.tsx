import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetSystemMailTemplatesQuery,
  GetSystemMailTemplatesDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";

import { SystemMailTemplateClient } from "./components/client";
import { SystemMailTemplateColumn } from "./components/columns";

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
export const metadata: Metadata = {
  title: 'メールテンプレート',
  openGraph: {
    title: 'メールテンプレート',
    ...commonMetadataOpenGraph,
  }
}

const SystemMailTemplatesPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<GetSystemMailTemplatesQuery>
    = await apolloServer()
      .query({
        query: GetSystemMailTemplatesDocument,
        variables: {
          first: 999,
          page: 1
        },
        fetchPolicy: 'network-only'
      });
  const SystemMailTemplates = ret.data.SystemMailTemplates.data;
  const paginatorInfo = ret.data.SystemMailTemplates.paginatorInfo as PaginatorInfo;

  const formattedSystemMailTemplates: SystemMailTemplateColumn[] = SystemMailTemplates.map((item) => ({
    id: item.id,
    code: item.code,
    subject_tpl: item.subject_tpl,
    body_tpl: item.body_tpl,
    from_mail: item.from_mail as string,
    bcc_mail: item.bcc_mail as string,
    valid_flg: (item.valid_flg ? '○' : '-'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SystemMailTemplateClient data={formattedSystemMailTemplates} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default SystemMailTemplatesPage;
