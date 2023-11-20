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

import AssetInfoApplyDownloadManager from "./asset-info-apply-download-manager";
import AssetInfoApplyListManager from "./asset-info-apply-list-manager";
import AssetInfoApprovalListManager from "./asset-info-approval-list-manager";
import AssetRegisterdList from "./asset-registerd-list";

interface AssetInfoBlockManagerProps {
  downloadApplies: ApplyDownload[]
  downloadAppliesPg: ApplyDownloadPaginator['paginatorInfo']
  applies: ApplyDownload[]
  appliesPg: ApplyDownloadPaginator['paginatorInfo']
  approvals: ApplyDownload[]
  approvalsPg: ApplyDownloadPaginator['paginatorInfo']
  cgAssets: CgAsset[]
  cgAssetsPg: CgAssetPaginator['paginatorInfo']
}

const AssetInfoBlockManager: React.FC<AssetInfoBlockManagerProps> = ({
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

  const assetInfoApplyDownloadManagerRef = useRef<{ handleSearch(txt: string): void } | undefined>();
  const assetInfoApplyListManagerRef = useRef<{ handleSearch(txt: string): void } | undefined>();
  const assetInfoApprovalListManagerRef = useRef<{ handleSearch(txt: string): void } | undefined>();
  const assetRegisterdListRef = useRef<{ handleSearch(txt: string): void } | undefined>();

  const handleSearch = () => {
    switch (selectedTab) {
      case 'apply_download':
        assetInfoApplyDownloadManagerRef?.current?.handleSearch(searchTxt)
        break;
      case 'apply_list':
        assetInfoApplyListManagerRef?.current?.handleSearch(searchTxt)
        break;
      case 'approval_list':
        assetInfoApprovalListManagerRef?.current?.handleSearch(searchTxt)
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
      <Tabs defaultValue="apply_download" className="flex flex-col w-full basis-2/3">
        <TabsList>
          <TabsTrigger value="apply_download" onClick={() => setSelectedTab('apply_download')}>ダウンロード申請</TabsTrigger>
          <TabsTrigger value="apply_list" onClick={() => setSelectedTab('apply_list')}>申請一覧</TabsTrigger>
          <TabsTrigger value="approval_list" onClick={() => setSelectedTab('approval_list')}>承認一覧</TabsTrigger>
          <TabsTrigger value="asset_registerd_list" onClick={() => setSelectedTab('asset_registerd_list')}>登録一覧</TabsTrigger>
        </TabsList>
        <TabsContent value="apply_download" className="flex-grow h-full overflow-y-auto">
          <AssetInfoApplyDownloadManager
            searchRef={assetInfoApplyDownloadManagerRef}
            downloadApplies={downloadApplies}
            downloadAppliesPg={downloadAppliesPg}
          />
        </TabsContent>
        <TabsContent value="apply_list" className="flex-grow h-full overflow-y-auto">
          <AssetInfoApplyListManager
            searchRef={assetInfoApplyListManagerRef}
            applies={applies}
            appliesPg={appliesPg}
          />
        </TabsContent>
        <TabsContent value="approval_list" className="flex-grow h-full overflow-y-auto">
          <AssetInfoApprovalListManager
            searchRef={assetInfoApprovalListManagerRef}
            approvals={approvals}
            approvalsPg={approvalsPg}
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

export default AssetInfoBlockManager