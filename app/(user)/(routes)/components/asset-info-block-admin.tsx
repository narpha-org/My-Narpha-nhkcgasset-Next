"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { ApplyDownload, CgAsset } from "@/graphql/generated/graphql";

import AssetInfoApplyDownloadAdmin from "./asset-info-apply-download-admin";
import AssetRegisterdList from "./asset-registerd-list";

interface AssetInfoBlockAdminProps {
  downloadApplies: ApplyDownload[]
  applies: ApplyDownload[]
  approvals: ApplyDownload[]
  cgAssets: CgAsset[]
}

const AssetInfoBlockAdmin: React.FC<AssetInfoBlockAdminProps> = ({
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
          <TabsTrigger value="asset_registerd_list">登録一覧</TabsTrigger>
        </TabsList>
        <TabsContent value="apply_download" className="flex-grow h-72 overflow-y-auto">
          <AssetInfoApplyDownloadAdmin
            downloadApplies={downloadApplies}
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

export default AssetInfoBlockAdmin