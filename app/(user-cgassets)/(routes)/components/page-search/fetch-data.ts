"use client";

import { Session } from "next-auth";

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetCgAssetsValidQuery,
  GetCgAssetsValidDocument,
  GetCgAssetsAllQuery,
  GetCgAssetsAllDocument,
  CgAsset,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

import { CgAssetsSearchFormValues } from "@/hooks/use-cgassets-search-form";
import { IsRoleOther, IsRoleUser } from "@/lib/check-role-client";
// import { isServerRoleUser } from "@/lib/check-role-server";

interface FetchDataProps {
  first: number;
  page: number;
  search: CgAssetsSearchFormValues;
  session: Session | null;
}

export async function fetchData(params: FetchDataProps) {
  let data: CgAsset[];
  let paginatorInfo: PaginatorInfo;

  if (IsRoleUser(params.session) || IsRoleOther(params.session)) {
    // 有効データのみ
    const ret: ApolloQueryResult<GetCgAssetsValidQuery> =
      await apolloClient.query({
        query: GetCgAssetsValidDocument,
        variables: params,
        fetchPolicy: "network-only",
      });
    data = ret.data.CGAssetsValid.data as CgAsset[];
    paginatorInfo = ret.data.CGAssetsValid.paginatorInfo as PaginatorInfo;
  } else {
    // 全データ
    // const ret: ApolloQueryResult<GetCgAssetsAllQuery> =
    //   await apolloClient.query({
    //     query: GetCgAssetsAllDocument,
    //     variables: params,
    //     fetchPolicy: "network-only",
    //   });
    // data = ret.data.CGAssetsAll.data as CgAsset[];
    // paginatorInfo = ret.data.CGAssetsAll.paginatorInfo as PaginatorInfo;
    // 有効データのみ
    const ret: ApolloQueryResult<GetCgAssetsValidQuery> =
      await apolloClient.query({
        query: GetCgAssetsValidDocument,
        variables: params,
        fetchPolicy: "network-only",
      });
    data = ret.data.CGAssetsValid.data as CgAsset[];
    paginatorInfo = ret.data.CGAssetsValid.paginatorInfo as PaginatorInfo;
  }

  return {
    data,
    paginatorInfo,
  };
}
