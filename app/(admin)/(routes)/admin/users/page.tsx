import { Metadata } from 'next'
import { format } from "date-fns";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetUsersQuery,
  GetUsersDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

// import { formatter } from "@/lib/utils";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { UserClient } from "./components/client";
import { UserColumn } from "./components/columns";

export const metadata: Metadata = {
  title: 'Oktaユーザ',
  openGraph: {
    title: 'Oktaユーザ',
    ...commonMetadataOpenGraph,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_DOMAIN ?
      `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}` :
      `http://localhost:3000`
  )
}

const UsersPage = async ({
  params
}: {
  params: {}
}) => {
  const ret: ApolloQueryResult<GetUsersQuery>
    = await apolloServer()
      .query({
        query: GetUsersDocument,
        variables: {
          first: 9999,
          page: 1
        },
        fetchPolicy: 'network-only'
      });
  const Users = ret.data.Users.data;
  const paginatorInfo = ret.data.Users.paginatorInfo as PaginatorInfo;

  const formattedUsers: UserColumn[] = Users.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    registAffili: item.registrantAffiliation?.desc as string,
    regist_affili_code: item.regist_affili_code as string,
    userRole: item.roleCGAssetStore?.desc as string,
    created_at: format(new Date(item.created_at), 'yyyy/MM/dd HH:ii'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserClient data={formattedUsers} paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
};

export default UsersPage;
