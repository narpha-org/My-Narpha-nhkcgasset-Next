"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { ApplyDownload, CgAsset } from "@/graphql/generated/graphql";

import AssetInfoApplyDownloadManager from "./asset-info-apply-download-manager";
import AssetInfoApplyListManager from "./asset-info-apply-list-manager";
import AssetInfoApprovalListManager from "./asset-info-approval-list-manager";
import AssetRegisterdList from "./asset-registerd-list";

interface AssetInfoBlockManagerProps {
  downloadApplies: ApplyDownload[]
  applies: ApplyDownload[]
  approvals: ApplyDownload[]
  cgAssets: CgAsset[]
}

const AssetInfoBlockManager: React.FC<AssetInfoBlockManagerProps> = ({
  downloadApplies,
  applies,
  approvals,
  cgAssets,
}) => {
  const router = useRouter();

  return (
    <>
      <div v-if="title" className="flex items-center justify-between">
        <i className="title_icon" />
        アセット情報
        <Button onClick={() => router.push(`/c_g_assets/new`)}>
          <Plus className="mr-2 h-4 w-4" /> アセット新規登録
        </Button>
      </div>
      <Tabs defaultValue="apply_download" className="flex flex-col w-full basis-2/3">
        <TabsList>
          <TabsTrigger value="apply_download">ダウンロード申請</TabsTrigger>
          <TabsTrigger value="apply_list">申請一覧</TabsTrigger>
          <TabsTrigger value="approval_list">承認一覧</TabsTrigger>
          <TabsTrigger value="asset_registerd_list">登録一覧</TabsTrigger>
        </TabsList>
        <TabsContent value="apply_download" className="flex-grow h-72 overflow-y-auto">
          <AssetInfoApplyDownloadManager
            downloadApplies={downloadApplies}
          />
        </TabsContent>
        <TabsContent value="apply_list" className="flex-grow h-72 overflow-y-auto">
          <AssetInfoApplyListManager
            applies={applies}
          />
        </TabsContent>
        <TabsContent value="approval_list" className="flex-grow h-72 overflow-y-auto">
          <AssetInfoApprovalListManager
            approvals={approvals}
          />
        </TabsContent>
        <TabsContent value="asset_registerd_list" className="flex-grow h-72 overflow-y-auto">
          <AssetRegisterdList
            cgAssets={cgAssets}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AssetInfoBlockManager