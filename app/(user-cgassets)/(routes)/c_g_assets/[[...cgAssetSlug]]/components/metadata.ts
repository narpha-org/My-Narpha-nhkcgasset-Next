import { Metadata } from "next";

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  GetCgAssetQuery,
  GetCgAssetDocument,
  CgAsset,
} from "@/graphql/generated/graphql";
import { commonMetadataOpenGraph } from "@/app/shared-metadata";

import { CGAssetPageProps, CGAssetPageSlug } from "./page-slug";

export async function generateMetadata({
  params,
}: CGAssetPageProps): Promise<Metadata> {
  if (!params.cgAssetSlug) {
    /* CGアセット一覧 */

    return {
      title: "CGアセット",
      openGraph: {
        title: "CGアセット",
        ...commonMetadataOpenGraph,
      },
    };
  }

  if (params.cgAssetSlug[0] && params.cgAssetSlug[0] === CGAssetPageSlug.New) {
    /* CGアセット新規追加 */

    return {
      title: "アセット追加 | CGアセット",
      openGraph: {
        title: "アセット追加 | CGアセット",
        ...commonMetadataOpenGraph,
      },
    };
  }

  if (params.cgAssetSlug[0] && params.cgAssetSlug[1]) {
    const ret: ApolloQueryResult<GetCgAssetQuery> = await apolloServer().query({
      query: GetCgAssetDocument,
      variables: {
        id: params.cgAssetSlug[0],
      },
    });
    const CGAsset = ret.data.CGAsset as CgAsset;

    if (CGAsset && CGAsset.asset_id) {
      switch (params.cgAssetSlug[1]) {
        case CGAssetPageSlug.Edit:
          /* CGアセット編集 */

          return {
            title: `ID:${CGAsset.asset_id} 詳細 | CGアセット`,
            openGraph: {
              title: `ID:${CGAsset.asset_id} 詳細 | CGアセット`,
              ...commonMetadataOpenGraph,
            },
          };

          break;
        case CGAssetPageSlug.ApplyDownload:
          /* CGアセット申請ダウンロード */

          return {
            title: `ID:${CGAsset.asset_id} ダウンロード申請 | CGアセット`,
            openGraph: {
              title: `ID:${CGAsset.asset_id} ダウンロード申請 | CGアセット`,
              ...commonMetadataOpenGraph,
            },
          };

          break;
        default:
          break;
      }
    }
  }

  return {
    title: "詳細 | CGアセット",
    openGraph: {
      title: "詳細 | CGアセット",
      ...commonMetadataOpenGraph,
    },
  };
}
