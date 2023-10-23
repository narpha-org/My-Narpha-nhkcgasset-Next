"use client";

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAssetPaginator,
  GetCgAssetsDocument,
} from "@/graphql/generated/graphql";

import { CGAssetSearchFormValues } from "@/hooks/use-search-form";

interface FetchDataProps {
  first: number;
  page: number;
  search: CGAssetSearchFormValues;
}

export async function fetchData(params: FetchDataProps) {
  const ret: ApolloQueryResult<{
    CGAssets: CgAssetPaginator;
  }> = await apolloClient.query({
    query: GetCgAssetsDocument,
    variables: params,
    fetchPolicy: "network-only",
  });
  const data = ret.data.CGAssets.data;
  const paginatorInfo = ret.data.CGAssets.paginatorInfo;

  return {
    data,
    paginatorInfo,
  };
}
