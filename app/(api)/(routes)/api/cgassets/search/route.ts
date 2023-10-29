import { NextRequest, NextResponse } from "next/server";
// import type { NextApiRequest, NextApiResponse } from "next";
// import { getServerSession } from "next-auth/next";
// import { Session } from "next-auth";
// import { authOptions } from "@/lib/auth-options";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAssetPaginator,
  ApiGetCgAssetsDocument,
} from "@/graphql/generated/graphql";
import { CGAssetSearchFormValues } from "@/hooks/use-search-form";
import { recursiveRemoveKey } from "@/lib/utils";

interface CgAssetsSearchParams {
  cates: string;
  tags: string;
  appprods: string;
  keyword: string;
  first: number;
  page: number;
}

export async function GET(req: NextRequest) {
  // const session: Session | null = await getServerSession(authOptions);
  const searchParams = req.nextUrl.searchParams;
  const cates = searchParams.get("cates");
  const tags = searchParams.get("tags");
  const appprods = searchParams.get("appprods");
  const keyword = searchParams.get("keyword");
  const first = searchParams.get("first");
  const page = searchParams.get("page");

  // if (!session || !session?.user || !session?.user.name) {
  //   return new NextResponse("Unauthorized", { status: 403 });
  // }

  if (!cates && !tags && !appprods && !keyword) {
    return new NextResponse("Search condition is required", { status: 400 });
  }

  const searchData: CGAssetSearchFormValues = {
    assetCates: [],
    assetTags: [],
    assetAppProds: [],
    keyword: "",
  };

  if (cates) {
    searchData.assetCates = cates.split(",");
  }
  if (tags) {
    searchData.assetTags = tags.split(",");
  }
  if (appprods) {
    searchData.assetAppProds = appprods.split(",");
  }
  if (keyword) {
    searchData.keyword = keyword;
  }

  try {
    const ret: ApolloQueryResult<{
      CGAssets: CgAssetPaginator;
    }> = await apolloServer().query({
      query: ApiGetCgAssetsDocument,
      variables: {
        first: Number(first) || 99,
        page: Number(page) || 1,
        search: searchData, //as CGAssetSearchFormValues
      },
    });
    const cgAssetPaginator = JSON.parse(JSON.stringify(ret.data.CGAssets));
    recursiveRemoveKey(cgAssetPaginator, "__typename");

    return NextResponse.json(cgAssetPaginator);
  } catch (error) {
    console.log("[CGASSETS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
