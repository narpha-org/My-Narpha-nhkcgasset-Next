import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetCgAssetSearchTagQuery,
  GetCgAssetSearchTagDocument,
  CgAssetSearchTag,
} from "@/graphql/generated/graphql";

import { CGAssetSearchTagForm } from "./components/c_g_asset_search_tag-form";

const CGAssetSearchTagPage = async ({
  params
}: {
  params: { cgAssetSearchTagId: string }
}) => {
  const ret: ApolloQueryResult<GetCgAssetSearchTagQuery>
    = await apolloServer()
      .query({
        query: GetCgAssetSearchTagDocument,
        variables: {
          id: params.cgAssetSearchTagId
        },
      });
  const CGAssetSearchTag = ret.data.CGAssetSearchTag as CgAssetSearchTag;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAssetSearchTagForm initialData={CGAssetSearchTag} />
      </div>
    </div>
  );
}

export default CGAssetSearchTagPage;
