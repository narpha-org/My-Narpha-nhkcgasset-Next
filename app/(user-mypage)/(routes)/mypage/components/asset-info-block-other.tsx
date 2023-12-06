"use client";

import { useRef, useState } from "react";
// import { Plus, Search } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Image from 'next/image'

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-raw"
// import { Input } from "@/components/ui/input-raw";
// import { Button } from "@/components/ui/button-raw";
import {
  ApplyDownload,
  ApplyDownloadPaginator,
  CgAsset,
  CgAssetPaginator
} from "@/graphql/generated/graphql";

import AssetInfoApplyDownloadOther from "./asset-info-apply-download-other";
// import AssetInfoApplyListOther from "./asset-info-apply-list-other";
// import AssetInfoApprovalListOther from "./asset-info-approval-list-other";

interface AssetInfoBlockOtherProps {
  downloadApplies: ApplyDownload[]
  downloadAppliesPg: ApplyDownloadPaginator['paginatorInfo']
  applies: ApplyDownload[]
  appliesPg: ApplyDownloadPaginator['paginatorInfo']
  approvals: ApplyDownload[]
  approvalsPg: ApplyDownloadPaginator['paginatorInfo']
  cgAssets: CgAsset[]
  cgAssetsPg: CgAssetPaginator['paginatorInfo']
}

const AssetInfoBlockOther: React.FC<AssetInfoBlockOtherProps> = ({
  downloadApplies,
  downloadAppliesPg,
  applies,
  appliesPg,
  approvals,
  approvalsPg,
  cgAssets,
  cgAssetsPg,
}) => {
  // const router = useRouter();

  const [searchTxt, setSearchTxt] = useState('');
  const [selectedTab, setSelectedTab] = useState('apply_download');

  const assetInfoApplyDownloadOtherRef = useRef<{ handleSearch(txt: string): void } | undefined>();
  const assetInfoApplyListOtherRef = useRef<{ handleSearch(txt: string): void } | undefined>();
  const assetInfoApprovalListOtherRef = useRef<{ handleSearch(txt: string): void } | undefined>();

  const handleSearch = () => {
    switch (selectedTab) {
      case 'apply_download':
        assetInfoApplyDownloadOtherRef?.current?.handleSearch(searchTxt)
        break;
      case 'apply_list':
        assetInfoApplyListOtherRef?.current?.handleSearch(searchTxt)
        break;
      case 'approval_list':
        assetInfoApprovalListOtherRef?.current?.handleSearch(searchTxt)
        break;
      default:
        break;
    }
  }

  return (
    <>
      <h2 className="mypage__title">アセット情報
        {/* <Input
          placeholder="検索文字入力"
          onChange={(event) => setSearchTxt((event.target as HTMLInputElement).value)}
          onKeyDown={(event) => { console.log(`event.code: ${event.code}`); if (event.code.toLowerCase() === 'enter') { console.log(`event.code is ${event.code}`); handleSearch(); } }}
        />
        <Button onClick={handleSearch}>
          検索
        </Button> */}
      </h2>

      <Tabs defaultValue={selectedTab} className="">
        <TabsList className="mypage__appry">
          <TabsTrigger className={cn(
            'li_alt',
            selectedTab === 'apply_download' ? 'on' : ''
          )} value="apply_download" onClick={() => setSelectedTab('apply_download')}>ダウンロード申請</TabsTrigger>
        </TabsList>
        <TabsContent value="apply_download" className="">
          <AssetInfoApplyDownloadOther
            searchRef={assetInfoApplyDownloadOtherRef}
            downloadApplies={downloadApplies}
            downloadAppliesPg={downloadAppliesPg}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AssetInfoBlockOther