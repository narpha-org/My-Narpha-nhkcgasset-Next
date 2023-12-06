import { NextRequest, NextResponse } from "next/server";
// import type { NextApiRequest, NextApiResponse } from "next";
// import { getServerSession } from "next-auth/next";
// import { Session } from "next-auth";
// import { authOptions } from "@/lib/auth-options";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  ApiGetCgAssetsQuery,
  ApiGetCgAssetsDocument,
  ApiCgAssetsSearchFormValues,
} from "@/graphql/generated/graphql";
// import { CgAssetsSearchFormValues } from "@/hooks/use-cgassets-search-form";
import { recursiveRemoveKey } from "@/lib/utils";

// type ApiCgAssetsSearchFormValues = {
//   assetCateDescs: string[];
//   assetGenres: string[];
//   assetAppProds: string[];
//   keyword: string;
// };

interface CgAssetsSearchParams {
  cates: string;
  genres: string;
  appprods: string;
  keyword: string;
  first: number;
  page: number;
}

export async function GET(req: NextRequest) {
  // const session: Session | null = await getServerSession(authOptions);
  const searchParams = req.nextUrl.searchParams;
  const cates = searchParams.get("cates");
  const genres = searchParams.get("genres");
  const appprods = searchParams.get("appprods");
  const keyword = searchParams.get("keyword");
  const first = searchParams.get("first");
  const page = searchParams.get("page");

  // if (!session || !session?.user || !session?.user.name) {
  //   return new NextResponse("Unauthorized", { status: 403 });
  // }

  if (!cates && !genres && !appprods && !keyword) {
    return new NextResponse("Search condition is required", { status: 400 });
  }

  const searchData: ApiCgAssetsSearchFormValues = {
    assetCateDescs: [],
    assetGenres: [],
    assetAppProds: [],
    keyword: "",
  };

  if (cates) {
    searchData.assetCateDescs = cates.split(",");
  }
  if (genres) {
    searchData.assetGenres = genres.split(",");
  }
  if (appprods) {
    searchData.assetAppProds = appprods.split(",");
  }
  if (keyword) {
    searchData.keyword = keyword;
  }

  try {
    const ret: ApolloQueryResult<ApiGetCgAssetsQuery> =
      await apolloServer().query({
        query: ApiGetCgAssetsDocument,
        variables: {
          first: Number(first) || 99,
          page: Number(page) || 1,
          search: searchData, //as CgAssetsSearchFormValues
        },
      });
    const cgAssetPaginator = JSON.parse(
      JSON.stringify(ret.data.ApiCGAssetsValid)
    );
    recursiveRemoveKey(cgAssetPaginator, "__typename");

    return NextResponse.json(cgAssetPaginator);
  } catch (error) {
    console.log("[CGASSETS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
