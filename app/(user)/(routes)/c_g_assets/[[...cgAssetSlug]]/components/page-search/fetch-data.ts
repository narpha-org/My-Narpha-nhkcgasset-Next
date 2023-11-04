"use client";

import { Session } from "next-auth";

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAsset,
  CgAssetPaginator,
  GetCgAssetsAllDocument,
  GetCgAssetsValidDocument,
  PaginatorInfo,
} from "@/graphql/generated/graphql";

import { CGAssetSearchFormValues } from "@/hooks/use-search-form";
import { IsRoleUser } from "@/lib/check-role-client";
import { isServerRoleUser } from "@/lib/check-role-server";

interface FetchDataProps {
  first: number;
  page: number;
  search: CGAssetSearchFormValues;
  session: Session | null;
}

export async function fetchData(params: FetchDataProps) {
  let data: CgAsset[];
  let paginatorInfo: PaginatorInfo;

  if (IsRoleUser(params.session)) {
    // 有効データのみ
    const ret: ApolloQueryResult<{
      CGAssetsValid: CgAssetPaginator;
    }> = await apolloClient.query({
      query: GetCgAssetsValidDocument,
      variables: params,
      fetchPolicy: "network-only",
    });
    data = ret.data.CGAssetsValid.data;
    paginatorInfo = ret.data.CGAssetsValid.paginatorInfo;
  } else {
    // 全データ
    const ret: ApolloQueryResult<{
      CGAssetsAll: CgAssetPaginator;
    }> = await apolloClient.query({
      query: GetCgAssetsAllDocument,
      variables: params,
      fetchPolicy: "network-only",
    });
    data = ret.data.CGAssetsAll.data;
    paginatorInfo = ret.data.CGAssetsAll.paginatorInfo;
  }

  return {
    data,
    paginatorInfo,
  };
}
