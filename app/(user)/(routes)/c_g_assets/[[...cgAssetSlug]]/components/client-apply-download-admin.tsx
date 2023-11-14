"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult } from "@apollo/client";
import {
  ApplyDownload,
  CgAsset,
  User,
  GetApplyDownloadDocument,
  GetCgAssetDocument,
  StatusApplyDownload,
  UsersManagerValidDocument,
} from "@/graphql/generated/graphql";
import { Loader } from "@/components/ui/loader";

import { CGAssetPageProps, CGAssetPageSlug } from './page-slug';
import CGAssetApplyDownloadView from './page-apply-download/apply-download-view';
import CGAssetApplyDownloadBoxDeliverForm from './page-apply-download/apply-download-box-deliver-form';
import CGAssetApplyDownloadBoxDeliverViewAdmin from './page-apply-download/apply-download-box-deliver-view-admin';
import CGAssetApplyDownloadRemovalView from './page-apply-download/apply-download-removal-view';

const CGAssetApplyDownloadClientAdmin: React.FC<CGAssetPageProps & {
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ params, setDialogOpen }) => {
  const [isMounted, setIsMounted] = useState(false);

  const [cgAsset, setCgAsset] = useState<CgAsset | null>(null);
  const [manageUsers, setManageUsers] = useState<User[] | null>(null);
  const [ApplyDownload, setApplyDownload] = useState<ApplyDownload | null>(null);

  useEffect(() => {

    (async () => {
      if (isMounted) {
        return;
      }

      if (
        !params.cgAssetSlug[0] ||
        !params.cgAssetSlug[1] ||
        params.cgAssetSlug[1] !== CGAssetPageSlug.ApplyDownload
      ) {
        /* 不正パラメータ */
        return
      }

      const ret: ApolloQueryResult<{
        CGAsset: CgAsset
      }> = await apolloClient
        .query({
          query: GetCgAssetDocument,
          variables: {
            id: params.cgAssetSlug[0]
          },
        });
      setCgAsset(ret.data.CGAsset);

      const retManageUser: ApolloQueryResult<{
        UsersManagerValid: User[]
      }> = await apolloClient
        .query({
          query: UsersManagerValidDocument,
        });
      setManageUsers(retManageUser.data.UsersManagerValid);

      if (params.cgAssetSlug[2]) {
        /* 承認・Box・消去 */

        const ret: ApolloQueryResult<{
          ApplyDownload: ApplyDownload
        }> = await apolloClient
          .query({
            query: GetApplyDownloadDocument,
            variables: {
              id: params.cgAssetSlug[2]
            },
          });
        setApplyDownload(ret.data.ApplyDownload);
      }

      setIsMounted(true);
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>;
  }

  if (
    !params.cgAssetSlug[0] ||
    !params.cgAssetSlug[1] ||
    params.cgAssetSlug[1] !== CGAssetPageSlug.ApplyDownload
  ) {
    /* 不正パラメータ */
    return null
  }

  if (params.cgAssetSlug[2]) {
    /* 承認・Box・消去 */

    switch (ApplyDownload?.status) {
      case StatusApplyDownload.Apply: // 申請中
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <CGAssetApplyDownloadView
                initialData={ApplyDownload}
                cgAsset={cgAsset}
                manageUsers={manageUsers}
                setDialogOpen={setDialogOpen}
                params={params}
              />
            </div>
          </div>
        );
      case StatusApplyDownload.Approval: // 承認済
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <CGAssetApplyDownloadBoxDeliverForm
                initialData={ApplyDownload}
                cgAsset={cgAsset}
                manageUsers={manageUsers}
                setDialogOpen={setDialogOpen}
                params={params}
              />
            </div>
          </div>
        );
      case StatusApplyDownload.BoxDeliver: // Boxリンク通知
      case StatusApplyDownload.DlNotice: // DL済み通知
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <CGAssetApplyDownloadBoxDeliverViewAdmin
                initialData={ApplyDownload}
                cgAsset={cgAsset}
                manageUsers={manageUsers}
                setDialogOpen={setDialogOpen}
                params={params}
              />
            </div>
          </div>
        );
      case StatusApplyDownload.Removal: // データ削除期限
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <CGAssetApplyDownloadRemovalView
                initialData={ApplyDownload}
                cgAsset={cgAsset}
                manageUsers={manageUsers}
                setDialogOpen={setDialogOpen}
                params={params}
              />
            </div>
          </div>
        );
      default:
        break;
    }
  }

  return <div>承認・Box・消去</div>
}

export default CGAssetApplyDownloadClientAdmin;
