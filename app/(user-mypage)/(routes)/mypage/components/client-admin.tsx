"use client";

import { useState, useEffect } from "react";

import { useCgAssetsSearchForm } from "@/hooks/use-cgassets-search-form";
import {
  SystemNotice,
  ApplyDownload,
  ApplyDownloadPaginator,
  CgAsset,
  CgAssetPaginator,
} from "@/graphql/generated/graphql";
import { NavHeaderMypage } from '@/components/nav-header-mypage';

import NoticeBlock from "./notice-block";
import AssetInfoBlock from "./asset-info-block";
import UserInfoBlock from "./user-info-block";

interface HomeDashboardClientAdminProps {
  systemNotices: SystemNotice[]
  downloadApplies: ApplyDownload[]
  downloadAppliesPg: ApplyDownloadPaginator['paginatorInfo']
  // applies: ApplyDownload[]
  // appliesPg: ApplyDownloadPaginator['paginatorInfo']
  // approvals: ApplyDownload[]
  // approvalsPg: ApplyDownloadPaginator['paginatorInfo']
  cgAssets: CgAsset[]
  cgAssetsPg: CgAssetPaginator['paginatorInfo']
}

export const HomeDashboardClientAdmin: React.FC<HomeDashboardClientAdminProps> = ({
  systemNotices,
  downloadApplies,
  downloadAppliesPg,
  // applies,
  // appliesPg,
  // approvals,
  // approvalsPg,
  cgAssets,
  cgAssetsPg
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const storeSearchInfo = useCgAssetsSearchForm();

  useEffect(() => {
    setIsMounted(true);

    (async () => {
      storeSearchInfo.resetCgAssetsSearchFormData()
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NavHeaderMypage />

      {/* <!-- main --> */}
      <main className="maincon">
        <div className="mypage">
          <div className="mypage__inner">
            <div className="mypage__mainbox">
              <div className="mypage__maincon">
                <div className="mypage__maincon-left">
                  <NoticeBlock
                    systemNotices={systemNotices}
                  />
                  <UserInfoBlock />
                </div>
                <div className="mypage__maincon-right">
                  <AssetInfoBlock
                    downloadApplies={downloadApplies}
                    downloadAppliesPg={downloadAppliesPg}
                    // applies={applies}
                    // appliesPg={appliesPg}
                    // approvals={approvals}
                    // approvalsPg={approvalsPg}
                    cgAssets={cgAssets}
                    cgAssetsPg={cgAssetsPg}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
