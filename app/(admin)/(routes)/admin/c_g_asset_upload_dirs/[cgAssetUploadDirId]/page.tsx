import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAssetUploadDir,
  GetCgAssetUploadDirDocument,
} from "@/graphql/generated/graphql";

import { CGAssetUploadDirForm } from "./components/c_g_asset_upload_dir-form";

const CGAssetUploadDirPage = async ({
  params
}: {
  params: { cgAssetUploadDirId: string }
}) => {
  const ret: ApolloQueryResult<{
    CGAssetUploadDir: CgAssetUploadDir
  }> = await apolloServer()
    .query({
      query: GetCgAssetUploadDirDocument,
      variables: {
        id: params.cgAssetUploadDirId
      },
    });
  const CGAssetUploadDir = ret.data.CGAssetUploadDir;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAssetUploadDirForm initialData={CGAssetUploadDir} />
      </div>
    </div>
  );
}

export default CGAssetUploadDirPage;
