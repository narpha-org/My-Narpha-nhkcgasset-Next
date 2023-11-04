"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { ApplyDownload } from "@/graphql/generated/graphql";

import AssetInfoApplyDownloadUser from "./asset-info-apply-download-user";
import AssetInfoApplyListUser from "./asset-info-apply-list-user";
import AssetInfoApprovalListUser from "./asset-info-approval-list-user";

interface AssetInfoBlockUserProps {
  downloadApplies: ApplyDownload[]
  applies: ApplyDownload[]
  approvals: ApplyDownload[]
}

const AssetInfoBlockUser: React.FC<AssetInfoBlockUserProps> = ({
  downloadApplies,
  applies,
  approvals,
}) => {
  const router = useRouter();

  return (
    <>
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        <i className="title_icon" />
        アセット情報
      </div>
      <Tabs defaultValue="apply_download" className="flex flex-col w-full basis-2/3">
        <TabsList>
          <TabsTrigger value="apply_download">ダウンロード申請</TabsTrigger>
          <TabsTrigger value="apply_list">申請一覧</TabsTrigger>
          <TabsTrigger value="approval_list">承認一覧</TabsTrigger>
        </TabsList>
        <TabsContent value="apply_download" className="flex-grow h-72 overflow-y-auto">
          <AssetInfoApplyDownloadUser
            downloadApplies={downloadApplies}
          />
        </TabsContent>
        <TabsContent value="apply_list" className="flex-grow h-72 overflow-y-auto">
          <AssetInfoApplyListUser
            applies={applies}
          />
        </TabsContent>
        <TabsContent value="approval_list" className="flex-grow h-72 overflow-y-auto">
          <AssetInfoApprovalListUser
            approvals={approvals}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AssetInfoBlockUser