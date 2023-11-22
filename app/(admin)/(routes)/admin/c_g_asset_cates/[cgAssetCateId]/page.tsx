import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetCgAssetCateQuery,
  GetCgAssetCateDocument,
  CgAssetCate,
} from "@/graphql/generated/graphql";

import { CGAssetCateForm } from "./components/c_g_asset_cate-form";

const CGAssetCatePage = async ({
  params
}: {
  params: { cgAssetCateId: string }
}) => {
  const ret: ApolloQueryResult<GetCgAssetCateQuery>
    = await apolloServer()
      .query({
        query: GetCgAssetCateDocument,
        variables: {
          id: params.cgAssetCateId
        },
      });
  const CGAssetCate = ret.data.CGAssetCate as CgAssetCate;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAssetCateForm initialData={CGAssetCate} />
      </div>
    </div>
  );
}

export default CGAssetCatePage;
