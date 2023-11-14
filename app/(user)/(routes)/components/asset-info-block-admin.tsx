"use client";

import { useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ApplyDownload,
  ApplyDownloadPaginator,
  CgAsset,
  CgAssetPaginator
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
      <div v-if="title" className="flex flex-row items-center mb-2">
        <div className="grow w-64">
          <i className="title_icon" />
          アセット情報
        </div>
        <div className="shrink w-48 justify-items-end mr-2">
          <Input
            placeholder="検索文字入力"
            onChange={(event) => setSearchTxt((event.target as HTMLInputElement).value)}
            onKeyDown={(event) => { console.log(`event.code: ${event.code}`); if (event.code.toLowerCase() === 'enter') { console.log(`event.code is ${event.code}`); handleSearch(); } }}
          />
        </div>
        <div className="shrink w-48 justify-items-end mr-2">
          <Button size="sm" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> 検索
          </Button>
        </div>
        <div className="shrink w-48 justify-items-end mr-2">
          <Button onClick={() => router.push(`/c_g_assets/new`)}>
            <Plus className="mr-2 h-4 w-4" /> アセット新規登録
          </Button>
        </div>
      </div>
      <Tabs defaultValue={selectedTab} className="flex flex-col w-full basis-2/3">
        <TabsList>
          <TabsTrigger value="apply_download" onClick={() => setSelectedTab('apply_download')}>ダウンロード申請</TabsTrigger>
          <TabsTrigger value="asset_registerd_list" onClick={() => setSelectedTab('asset_registerd_list')}> 登録一覧</TabsTrigger>
        </TabsList>
        <TabsContent value="apply_download" className="flex-grow h-full overflow-y-auto">
          <AssetInfoApplyDownloadAdmin
            searchRef={assetInfoApplyDownloadAdminRef}
            downloadApplies={downloadApplies}
            downloadAppliesPg={downloadAppliesPg}
          />
        </TabsContent>
        <TabsContent value="asset_registerd_list" className="flex-grow h-full overflow-y-auto">
          <AssetRegisterdList
            searchRef={assetRegisterdListRef}
            cgAssets={cgAssets}
            cgAssetsPg={cgAssetsPg}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AssetInfoBlockAdmin