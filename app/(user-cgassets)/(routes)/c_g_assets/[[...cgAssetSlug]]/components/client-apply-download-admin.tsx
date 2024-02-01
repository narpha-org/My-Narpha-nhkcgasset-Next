"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult } from "@apollo/client";
import {
  GetCgAssetQuery,
  GetCgAssetDocument,
  CgAsset,
  UsersManagerValidQuery,
  UsersManagerValidDocument,
  User,
  GetApplyDownloadQuery,
  GetApplyDownloadDocument,
  ApplyDownload,
  StatusApplyDownload,
} from "@/graphql/generated/graphql";
import { Loader } from "@/components/ui/loader";

import { CGAssetPageProps, CGAssetPageSlug } from './page-slug';
import CGAssetApplyDownloadApplyView from './page-apply-download/apply-download-apply-view';
import CGAssetApplyDownloadBoxDeliverForm from './page-apply-download/apply-download-box-deliver-form';
import CGAssetApplyDownloadBoxDeliverViewAdmin from './page-apply-download/apply-download-box-deliver-view-admin';
import CGAssetApplyDownloadDlNoticeViewAdmin from './page-apply-download/apply-download-dl-notice-view-admin';
import CGAssetApplyDownloadRemovalView from './page-apply-download/apply-download-removal-view';
import CGAssetApplyDownloadDoneView from "./page-apply-download/apply-download-done-view";
import CGAssetApplyDownloadGlacierForm from "./page-apply-download/apply-download-glacier-form";

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

      const ret: ApolloQueryResult<GetCgAssetQuery>
        = await apolloClient
          .query({
            query: GetCgAssetDocument,
            variables: {
              id: params.cgAssetSlug[0]
            },
          });
      setCgAsset(ret.data.CGAsset as CgAsset);

      const retManageUser: ApolloQueryResult<UsersManagerValidQuery>
        = await apolloClient
          .query({
            query: UsersManagerValidDocument,
          });
      setManageUsers(retManageUser.data.UsersManagerValid as User[]);

      if (params.cgAssetSlug[2]) {
        /* 承認・Box・消去 */

        const ret: ApolloQueryResult<GetApplyDownloadQuery>
          = await apolloClient
            .query({
              query: GetApplyDownloadDocument,
              variables: {
                id: params.cgAssetSlug[2]
              },
            });
        setApplyDownload(ret.data.ApplyDownloadWithPresignedUrl as ApplyDownload);
      }

      setIsMounted(true);
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return <div className="flex items-center justify-center h-full">
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
              <CGAssetApplyDownloadApplyView
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
      case StatusApplyDownload.DlNotice: // DL済み通知
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <CGAssetApplyDownloadDlNoticeViewAdmin
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
      case StatusApplyDownload.Done: // データ消去完了
        /* 消去へ */
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <CGAssetApplyDownloadDoneView
                initialData={ApplyDownload}
                cgAsset={cgAsset}
                manageUsers={manageUsers}
                setDialogOpen={setDialogOpen}
                params={params}
              />
            </div>
          </div>
        );
      case StatusApplyDownload.BoxReady: // リンク準備完了
      default:
        break;
    }

    return <div>承認・Box・消去</div>

  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAssetApplyDownloadGlacierForm
          initialData={null}
          cgAsset={cgAsset}
          manageUsers={manageUsers}
          setDialogOpen={setDialogOpen}
          params={params}
        />
      </div>
    </div>
  );
}

export default CGAssetApplyDownloadClientAdmin;
