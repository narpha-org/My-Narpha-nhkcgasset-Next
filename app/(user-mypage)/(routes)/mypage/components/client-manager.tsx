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

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import NoticeBlock from "./notice-block";
import AssetInfoBlock from "./asset-info-block";
import UserInfoBlock from "./user-info-block";

interface HomeDashboardClientManagerProps {
  systemNotices: SystemNotice[]
  downloadApplies: ApplyDownload[]
  downloadAppliesPg: ApplyDownloadPaginator['paginatorInfo']
  applies: ApplyDownload[]
  appliesPg: ApplyDownloadPaginator['paginatorInfo']
  approvals: ApplyDownload[]
  approvalsPg: ApplyDownloadPaginator['paginatorInfo']
  cgAssets: CgAsset[]
  cgAssetsPg: CgAssetPaginator['paginatorInfo']
}

export const HomeDashboardClientManager: React.FC<HomeDashboardClientManagerProps> = ({
  systemNotices,
  downloadApplies,
  downloadAppliesPg,
  applies,
  appliesPg,
  approvals,
  approvalsPg,
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
      <div className="flex items-center justify-between">
        <Heading title="ホーム画面" description="お知らせ、申請等" />
      </div>
      <Separator />
      <div className="flex flex-row">
        <div className="basis-1/3">
          <div className="flex flex-col w-full overflow-hidden h-64 px-3 py-2">
            <NoticeBlock
              systemNotices={systemNotices}
            />
          </div>
          <div className="flex flex-col w-full overflow-hidden h-full px-3 py-2">
            <UserInfoBlock />
          </div>
        </div>
        <div className="basis-2/3">
          <div className="flex flex-col w-full px-3 py-2">
            <AssetInfoBlock
              downloadApplies={downloadApplies}
              downloadAppliesPg={downloadAppliesPg}
              applies={applies}
              appliesPg={appliesPg}
              approvals={approvals}
              approvalsPg={approvalsPg}
              cgAssets={cgAssets}
              cgAssetsPg={cgAssetsPg}
            />
          </div>
        </div>
      </div>
    </>
  );
};
