import { Metadata } from 'next'

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  CgAsset,
  GetCgAssetDocument,
  CgAssetCate,
  // GetCgAssetCatesValidDocument,
  CgaRegistrantAffiliation,
  // GetCgaRegistrantAffilliationsValidDocument,
  CgaViewingRestriction,
  // GetCgaViewingRestrictionsValidDocument,
  CgaBroadcastingRight,
  // GetCgaBroadcastingRightsValidDocument,
  CgaSharedArea,
  // GetCgaSharedAreasValidDocument,
  CgAssetUploadDir,
  // GetCgAssetUploadDirsValidDocument,
  CgAssetEditClientDocument,
} from "@/graphql/generated/graphql";

import { CGAssetForm } from "./page-edit/c_g_asset-form";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { CGAssetPageProps, CGAssetPageSlug } from './page-slug';
import { isServerRoleOther, isServerRoleUser } from '@/lib/check-role-server';
import UserUnauthorized from "@/app/(user)/user-unauthorized";

export async function generateMetadata({
  params,
}: {
  params: { cgAssetId: string },
}): Promise<Metadata> {

  const ret: ApolloQueryResult<{
    CGAsset: CgAsset
  }> = await apolloServer()
    .query({
      query: GetCgAssetDocument,
      variables: {
        id: params.cgAssetId
      },
    });
  const CGAsset = ret.data.CGAsset;

  if (CGAsset && CGAsset.asset_id) {
    return {
      title: `ID:${CGAsset.asset_id} 編集 | CGアセット`,
      openGraph: {
        title: `ID:${CGAsset.asset_id} 編集 | CGアセット`,
        ...commonMetadataOpenGraph,
      }
    };
  }

  return {
    title: '編集 | CGアセット',
    openGraph: {
      title: '編集 | CGアセット',
      ...commonMetadataOpenGraph,
    }
  }
}

const CGAssetEditClient: React.FC<CGAssetPageProps> = async ({ params }) => {

  if (await isServerRoleUser() || await isServerRoleOther()) {
    return <UserUnauthorized />;
  }

  let CGAsset: CgAsset | null = null;

  if (
    params.cgAssetSlug[0] &&
    params.cgAssetSlug[0] !== CGAssetPageSlug.New
  ) {
    const ret: ApolloQueryResult<{
      CGAsset: CgAsset
    }> = await apolloServer()
      .query({
        query: GetCgAssetDocument,
        variables: {
          id: params.cgAssetSlug[0]
        },
      });
    CGAsset = ret.data.CGAsset;
  }

  // const retCate: ApolloQueryResult<{
  //   CGAssetCatesValid: CgAssetCate[]
  // }> = await apolloServer()
  //   .query({
  //     query: GetCgAssetCatesValidDocument,
  //   });
  // const assetCates = retCate.data.CGAssetCatesValid;

  // const retRegistrantAffiliation: ApolloQueryResult<{
  //   CGARegistrantAffiliationsValid: CgaRegistrantAffiliation[]
  // }> = await apolloServer()
  //   .query({
  //     query: GetCgaRegistrantAffilliationsValidDocument,
  //   });
  // const registrantAffiliations = retRegistrantAffiliation.data.CGARegistrantAffiliationsValid;

  // const retviewingRestriction: ApolloQueryResult<{
  //   CGAViewingRestrictionsValid: CgaViewingRestriction[]
  // }> = await apolloServer()
  //   .query({
  //     query: GetCgaViewingRestrictionsValidDocument,
  //   });
  // const viewingRestrictions = retviewingRestriction.data.CGAViewingRestrictionsValid;

  // const retBroadcastingRight: ApolloQueryResult<{
  //   CGABroadcastingRightsValid: CgaBroadcastingRight[]
  // }> = await apolloServer()
  //   .query({
  //     query: GetCgaBroadcastingRightsValidDocument,
  //   });
  // const broadcastingRights = retBroadcastingRight.data.CGABroadcastingRightsValid;

  // const retSharedArea: ApolloQueryResult<{
  //   CGASharedAreasValid: CgaSharedArea[]
  // }> = await apolloServer()
  //   .query({
  //     query: GetCgaSharedAreasValidDocument,
  //   });
  // const sharedAreas = retSharedArea.data.CGASharedAreasValid;

  // const retUploadDir: ApolloQueryResult<{
  //   CGAssetUploadDirsValid: CgAssetUploadDir[]
  // }> = await apolloServer()
  //   .query({
  //     query: GetCgAssetUploadDirsValidDocument,
  //   });
  // const uploadDirs = retUploadDir.data.CGAssetUploadDirsValid;

  const ret: ApolloQueryResult<{
    CGAssetCatesValid: CgAssetCate[]
    CGARegistrantAffiliationsValid: CgaRegistrantAffiliation[]
    CGAViewingRestrictionsValid: CgaViewingRestriction[]
    CGABroadcastingRightsValid: CgaBroadcastingRight[]
    CGASharedAreasValid: CgaSharedArea[]
    CGAssetUploadDirsValid: CgAssetUploadDir[]
  }> = await apolloServer()
    .query({
      query: CgAssetEditClientDocument,
    });
  const assetCates = ret.data.CGAssetCatesValid;
  const registrantAffiliations = ret.data.CGARegistrantAffiliationsValid;
  const viewingRestrictions = ret.data.CGAViewingRestrictionsValid;
  const broadcastingRights = ret.data.CGABroadcastingRightsValid;
  const sharedAreas = ret.data.CGASharedAreasValid;
  const uploadDirs = ret.data.CGAssetUploadDirsValid;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAssetForm
          initialData={CGAsset}
          assetCates={assetCates}
          registrantAffiliations={registrantAffiliations}
          viewingRestrictions={viewingRestrictions}
          broadcastingRights={broadcastingRights}
          sharedAreas={sharedAreas}
          uploadDirs={uploadDirs}
        />
      </div>
    </div>
  );
}

export default CGAssetEditClient;
