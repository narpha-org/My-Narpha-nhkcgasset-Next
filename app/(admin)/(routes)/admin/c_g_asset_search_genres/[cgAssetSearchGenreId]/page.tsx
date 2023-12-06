import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetCgAssetSearchGenreQuery,
  GetCgAssetSearchGenreDocument,
  CgAssetSearchGenre,
} from "@/graphql/generated/graphql";

import { CGAssetSearchGenreForm } from "./components/c_g_asset_search_genre-form";

const CGAssetSearchGenrePage = async ({
  params
}: {
  params: { cgAssetSearchGenreId: string }
}) => {
  const ret: ApolloQueryResult<GetCgAssetSearchGenreQuery>
    = await apolloServer()
      .query({
        query: GetCgAssetSearchGenreDocument,
        variables: {
          id: params.cgAssetSearchGenreId
        },
      });
  const CGAssetSearchGenre = ret.data.CGAssetSearchGenre as CgAssetSearchGenre;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAssetSearchGenreForm initialData={CGAssetSearchGenre} />
      </div>
    </div>
  );
}

export default CGAssetSearchGenrePage;
