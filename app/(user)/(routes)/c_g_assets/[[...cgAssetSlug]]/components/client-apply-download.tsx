import { Metadata } from 'next'

import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult } from "@apollo/client";
import {
  ApplyDownload,
  CgAsset,
  GetApplyDownloadDocument,
  GetCgAssetDocument,
  StatusApplyDownload,
} from "@/graphql/generated/graphql";

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { CGAssetPageProps, CGAssetPageSlug } from './page-slug';
import CGAssetApplyDownloadForm from './page-apply-download/apply-download-form';
import CGAssetApplyDownloadApprovalForm from './page-apply-download/apply-download-approval-form';
import CGAssetApplyDownloadBoxDeliverForm from './page-apply-download/apply-download-box-deliver-form';
import CGAssetApplyDownloadRemovalForm from './page-apply-download/apply-download-removal-form';

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
      title: `ID:${CGAsset.asset_id} ダウンロード申請 | CGアセット`,
      openGraph: {
        title: `ID:${CGAsset.asset_id} ダウンロード申請 | CGアセット`,
        ...commonMetadataOpenGraph,
      }
    };
  }

  return {
    title: 'ダウンロード申請 | CGアセット',
    openGraph: {
      title: 'ダウンロード申請 | CGアセット',
      ...commonMetadataOpenGraph,
    }
  }
}

const CGAssetApplyDownloadClient: React.FC<CGAssetPageProps> = async ({ params }) => {

  if (
    !params.cgAssetSlug[0] ||
    !params.cgAssetSlug[1] ||
    params.cgAssetSlug[1] !== CGAssetPageSlug.ApplyDownload
  ) {
    /* 不正パラメータ */
    return null
  }

  const ret: ApolloQueryResult<{
    CGAsset: CgAsset
  }> = await apolloServer()
    .query({
      query: GetCgAssetDocument,
      variables: {
        id: params.cgAssetSlug[0]
      },
    });
  const CGAsset = ret.data.CGAsset;

  if (params.cgAssetSlug[2]) {
    /* 承認・Box・消去 */

    const ret: ApolloQueryResult<{
      ApplyDownload: ApplyDownload
    }> = await apolloServer()
      .query({
        query: GetApplyDownloadDocument,
        variables: {
          id: params.cgAssetSlug[2]
        },
      });
    const ApplyDownload = ret.data.ApplyDownload;

    switch (ApplyDownload.status) {
      case StatusApplyDownload.Apply: // 申請中
        /* 承認へ */
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <CGAssetApplyDownloadApprovalForm
                initialData={CGAsset}
              />
            </div>
          </div>
        );
        break;
      case StatusApplyDownload.Approval: // 承認済
        /* Box送付へ */
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <CGAssetApplyDownloadBoxDeliverForm
                initialData={CGAsset}
              />
            </div>
          </div>
        );
        break;
      case StatusApplyDownload.BoxDeliver: // Box送付
        /* 消去へ */
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <CGAssetApplyDownloadRemovalForm
                initialData={CGAsset}
              />
            </div>
          </div>
        );
        break;
      default:
        break;
    }

    return <div>承認・Box・消去</div>

  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAssetApplyDownloadForm
          initialData={CGAsset}
        />
      </div>
    </div>
  );
}

export default CGAssetApplyDownloadClient;
