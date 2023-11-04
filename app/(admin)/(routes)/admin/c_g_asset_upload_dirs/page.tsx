import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAssetUploadDirPaginator,
  GetCgAssetUploadDirsDocument,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { CGAssetUploadDirClient } from "./components/client";
import { CGAssetUploadDirColumn } from "./components/columns";

export const metadata: Metadata = {
  title: 'アップロード場所',
  openGraph: {
    title: 'アップロード場所',
    ...commonMetadataOpenGraph,
  }
}

const CGAssetUploadDirsPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<{
    CGAssetUploadDirs: CgAssetUploadDirPaginator
  }> = await apolloServer()
    .query({
      query: GetCgAssetUploadDirsDocument,
      variables: {
        first: 999,
        page: 1
      },
      fetchPolicy: 'network-only'
    });
  const CGAssetUploadDirs = ret.data.CGAssetUploadDirs.data;
  const paginatorInfo = ret.data.CGAssetUploadDirs.paginatorInfo;

  const formattedCGAssetUploadDirs: CGAssetUploadDirColumn[] = CGAssetUploadDirs.map((item) => ({
    id: item.id,
    base_path: item.base_path,
    order: item.order as number,
    valid_flg: (item.valid_flg ? '○' : '-'),
    created_at: format(new Date(item.created_at), 'yyyy/MM/dd HH:ii'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAssetUploadDirClient data={formattedCGAssetUploadDirs} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default CGAssetUploadDirsPage;
