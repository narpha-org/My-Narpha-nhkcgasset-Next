import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  ApplyDownloadMailTpl,
  GetApplyDownloadMailTplsDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";

import { ApplyDownloadMailTplClient } from "./components/client";
import { ApplyDownloadMailTplColumn } from "./components/columns";

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
export const metadata: Metadata = {
  title: '申請メールテンプレート',
  openGraph: {
    title: '申請メールテンプレート',
    ...commonMetadataOpenGraph,
  }
}

const ApplyDownloadMailTplsPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<{
    ApplyDownloadMailTpls: {
      data: ApplyDownloadMailTpl[];
      paginatorInfo: PaginatorInfo;
    }
  }> = await apolloServer()
    .query({
      query: GetApplyDownloadMailTplsDocument,
      variables: {
        first: 999,
        page: 1
      },
      fetchPolicy: 'network-only'
    });
  const ApplyDownloadMailTpls = ret.data.ApplyDownloadMailTpls.data;
  const paginatorInfo = ret.data.ApplyDownloadMailTpls.paginatorInfo;

  const formattedApplyDownloadMailTpls: ApplyDownloadMailTplColumn[] = ApplyDownloadMailTpls.map((item) => ({
    id: item.id,
    status: item.status,
    subject_tpl: item.subject_tpl,
    body_tpl: item.body_tpl,
    from_mail: item.from_mail as string,
    bcc_mail: item.bcc_mail as string,
    valid_flg: (item.valid_flg ? '○' : '-'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ApplyDownloadMailTplClient data={formattedApplyDownloadMailTpls} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default ApplyDownloadMailTplsPage;
