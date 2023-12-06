"use client";

import { useRef, useState } from "react";
// import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from 'next/image'

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-raw"
// import { Input } from "@/components/ui/input-raw";
// import { Button } from "@/components/ui/button-raw";
import {
  ApplyDownload,
  ApplyDownloadPaginator,
  CgAsset,
  CgAssetPaginator,
  CgAssetsSearchSection
} from "@/graphql/generated/graphql";

import AssetInfoApplyDownloadAdmin from "./asset-info-apply-download-admin";
import AssetRegisterdList from "./asset-registerd-list";

interface AssetInfoBlockAdminProps {
  downloadApplies: ApplyDownload[]
  downloadAppliesPg: ApplyDownloadPaginator['paginatorInfo']
  applies: ApplyDownload[]
  appliesPg: ApplyDownloadPaginator['paginatorInfo']
  approvals: ApplyDownload[]
  approvalsPg: ApplyDownloadPaginator['paginatorInfo']
  cgAssets: CgAsset[]
  cgAssetsPg: CgAssetPaginator['paginatorInfo']
}

const AssetInfoBlockAdmin: React.FC<AssetInfoBlockAdminProps> = ({
  downloadApplies,
  downloadAppliesPg,
  applies,
  appliesPg,
  approvals,
  approvalsPg,
  cgAssets,
  cgAssetsPg,
}) => {
  const router = useRouter();

  const [searchTxt, setSearchTxt] = useState('');
  const [selectedTab, setSelectedTab] = useState('apply_download');

  const assetInfoApplyDownloadAdminRef = useRef<{ handleSearch(txt: string): void } | undefined>();
  const assetRegisterdListRef = useRef<{ handleSearch(txt: string): void } | undefined>();

  const handleSearch = () => {
    // console.log(`parent handleSearch txt:${searchTxt}`);
    // console.log(`parent handleSearch assetInfoApplyDownloadAdminRef:${assetInfoApplyDownloadAdminRef}`);
    // console.log(`parent handleSearch assetInfoApplyDownloadAdminRef.current:${assetInfoApplyDownloadAdminRef?.current}`);
    // console.log(`parent handleSearch assetInfoApplyDownloadAdminRef.current.handleSearch:${assetInfoApplyDownloadAdminRef?.current?.handleSearch}`);
    switch (selectedTab) {
      case 'apply_download':
        assetInfoApplyDownloadAdminRef?.current?.handleSearch(searchTxt)
        break;
      case 'asset_registerd_list':
        assetRegisterdListRef?.current?.handleSearch(searchTxt)
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
        <button
          className="registration"
          onClick={() => router.push(`/c_g_assets/new`)}
        >アセット新規登録<Image
            src="/assets/images/plus.svg" width="9" height="9" decoding="async" alt="" /></button></h2>

      <Tabs defaultValue={selectedTab} className="">
        <TabsList className="mypage__appry">
          <TabsTrigger className={cn(
            'li_alt',
            selectedTab === 'apply_download' ? 'on' : ''
          )} value="apply_download" onClick={() => setSelectedTab('apply_download')}>ダウンロード申請</TabsTrigger>
          <TabsTrigger className={cn(
            'li_alt',
            selectedTab === 'asset_registerd_list' ? 'on' : ''
          )} value="asset_registerd_list" onClick={() => setSelectedTab('asset_registerd_list')}>アセット登録</TabsTrigger>
        </TabsList>
        <TabsContent value="apply_download" className="">
          <AssetInfoApplyDownloadAdmin
            searchRef={assetInfoApplyDownloadAdminRef}
            downloadApplies={downloadApplies}
            downloadAppliesPg={downloadAppliesPg}
          />
        </TabsContent>
        <TabsContent value="asset_registerd_list" className="">
          <AssetRegisterdList
            searchRef={assetRegisterdListRef}
            cgAssets={cgAssets}
            cgAssetsPg={cgAssetsPg}
            cgAssetsSearchSection={`${CgAssetsSearchSection.CgassetsSearchedByAdmin}`}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AssetInfoBlockAdmin