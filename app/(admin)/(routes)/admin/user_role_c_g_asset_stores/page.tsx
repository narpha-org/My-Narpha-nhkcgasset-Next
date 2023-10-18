import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  UserRoleCgAssetStore,
  GetUserRoleCgAssetStoresDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

import { formatter } from "@/lib/utils";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { UserRoleCgAssetStoreClient } from "./components/client";
import { UserRoleCgAssetStoreColumn } from "./components/columns";

export const metadata: Metadata = {
  title: 'CGアセットストアロール',
  openGraph: {
    title: 'CGアセットストアロール',
    ...commonMetadataOpenGraph,
  }
}

const UserRoleCgAssetStoresPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<{
    UserRoleCGAssetStores: {
      data: UserRoleCgAssetStore[];
      paginatorInfo: PaginatorInfo;
    }
  }> = await apolloServer()
    .query({
      query: GetUserRoleCgAssetStoresDocument,
      variables: {
        first: 999,
        page: 1
      },
      fetchPolicy: 'network-only'
    });
  const UserRoleCGAssetStores = ret.data.UserRoleCGAssetStores.data;
  const paginatorInfo = ret.data.UserRoleCGAssetStores.paginatorInfo;

  const formattedUserRoleCGAssetStores: UserRoleCgAssetStoreColumn[] = UserRoleCGAssetStores.map((item) => ({
    id: item.id,
    role: item.role,
    desc: item.desc,
    order: item.order as number,
    valid_flg: (item.valid_flg ? '○' : '-'),
    created_at: format(new Date(item.created_at), 'yyyy/MM/dd HH:ii'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserRoleCgAssetStoreClient data={formattedUserRoleCGAssetStores} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default UserRoleCgAssetStoresPage;
