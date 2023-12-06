import { Metadata } from 'next'

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  GetCgAssetQuery,
  GetCgAssetDocument,
  CgAsset,
  CgAssetEditClientQuery,
  CgAssetEditClientDocument,
  CgAssetCate,
  CgaRegistrantAffiliation,
  CgaViewingRestriction,
  CgaBroadcastingRight,
  CgaSharedArea,
  CgAssetUploadDir,
} from "@/graphql/generated/graphql";

import { CGAssetForm } from "./page-edit/c_g_asset-form";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { CGAssetPageProps, CGAssetPageSlug } from '../../../components/page-slug';
import { isServerRoleOther, isServerRoleUser } from '@/lib/check-role-server';
import UserUnauthorized from "@/app/user-unauthorized";

export async function generateMetadata({
  params,
}: {
  params: { cgAssetId: string },
}): Promise<Metadata> {

  const ret: ApolloQueryResult<GetCgAssetQuery>
    = await apolloServer()
      .query({
        query: GetCgAssetDocument,
        variables: {
          id: params.cgAssetId
        },
      });
  const CGAsset = ret.data.CGAsset as CgAsset;

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
    const ret: ApolloQueryResult<GetCgAssetQuery>
      = await apolloServer()
        .query({
          query: GetCgAssetDocument,
          variables: {
            id: params.cgAssetSlug[0]
          },
        });
    CGAsset = ret.data.CGAsset as CgAsset;
  }

  const ret: ApolloQueryResult<CgAssetEditClientQuery>
    = await apolloServer()
      .query({
        query: CgAssetEditClientDocument,
      });
  const assetCates = ret.data.CGAssetCatesValid as CgAssetCate[];
  const registrantAffiliations = ret.data.CGARegistrantAffiliationsValid as CgaRegistrantAffiliation[];
  const viewingRestrictions = ret.data.CGAViewingRestrictionsValid as CgaViewingRestriction[];
  const broadcastingRights = ret.data.CGABroadcastingRightsValid as CgaBroadcastingRight[];
  const sharedAreas = ret.data.CGASharedAreasValid as CgaSharedArea[];
  const uploadDirs = ret.data.CGAssetUploadDirsValid as CgAssetUploadDir[];

  return (
    // <div className="flex-col">
    //   <div className="flex-1 space-y-4 p-8 pt-6">
    <CGAssetForm
      initialData={CGAsset}
      assetCates={assetCates}
      registrantAffiliations={registrantAffiliations}
      viewingRestrictions={viewingRestrictions}
      broadcastingRights={broadcastingRights}
      sharedAreas={sharedAreas}
      uploadDirs={uploadDirs}
    />
    //   </div>
    // </div>
  );
}

export default CGAssetEditClient;
