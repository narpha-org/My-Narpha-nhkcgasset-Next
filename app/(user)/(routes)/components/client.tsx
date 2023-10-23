"use client";

import { useState, useEffect } from "react";

import { useSearchForm } from "@/hooks/use-search-form";
import {
  SystemNotice,
  ApplyDownload,
} from "@/graphql/generated/graphql";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import NoticeBlock from "./notice-block";
import AssetInfoBlock from "./asset-info-block";
import UserInfoBlock from "./user-info-block";

interface HomeDashboardClientProps {
  systemNotices: SystemNotice[]
  downloadNoRemovals: ApplyDownload[]
  downloadEntries: ApplyDownload[]
  downloadApprovals: ApplyDownload[]
}

export const HomeDashboardClient: React.FC<HomeDashboardClientProps> = ({
  systemNotices,
  downloadNoRemovals,
  downloadEntries,
  downloadApprovals,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const storeSearchInfo = useSearchForm();

  useEffect(() => {
    setIsMounted(true);

    (async () => {
      storeSearchInfo.resetSearchFormData()
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
        <div className="basis-2/3">
          <div className="flex flex-col w-full overflow-hidden h-64 px-3 py-2">
            <NoticeBlock
              systemNotices={systemNotices}
            />
          </div>
          <div className="flex flex-col w-full px-3 py-2">
            <AssetInfoBlock
              downloadNoRemovals={downloadNoRemovals}
              downloadEntries={downloadEntries}
              downloadApprovals={downloadApprovals}
            />
          </div>
        </div>
        <div className="basis-1/3">
          <div className="flex flex-col w-full overflow-hidden h-full px-3 py-2">
            <UserInfoBlock />
          </div>
        </div>
      </div>
    </>
  );
};
