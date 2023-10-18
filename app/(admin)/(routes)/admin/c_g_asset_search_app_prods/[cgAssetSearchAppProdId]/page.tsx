import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAssetSearchAppProd,
  GetCgAssetSearchAppProdDocument,
} from "@/graphql/generated/graphql";

import { CGAssetSearchAppProdForm } from "./components/c_g_asset_search_app_prods-form";

const CGAssetSearchAppProdPage = async ({
  params
}: {
  params: { cgAssetSearchAppProdId: string }
}) => {
  const ret: ApolloQueryResult<{
    CGAssetSearchAppProd: CgAssetSearchAppProd
  }> = await apolloServer()
    .query({
      query: GetCgAssetSearchAppProdDocument,
      variables: {
        id: params.cgAssetSearchAppProdId
      },
    });
  const CGAssetSearchAppProd = ret.data.CGAssetSearchAppProd;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAssetSearchAppProdForm initialData={CGAssetSearchAppProd} />
      </div>
    </div>
  );
}

export default CGAssetSearchAppProdPage;
