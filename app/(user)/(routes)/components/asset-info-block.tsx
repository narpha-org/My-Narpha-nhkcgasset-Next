"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApplyDownload } from "@/graphql/generated/graphql";
import AssetInfoApplyDownload from "./asset-info-apply-download";
import AssetInfoApplyList from "./asset-info-apply-list";
import AssetInfoApprovalList from "./asset-info-approval-list";

interface AssetInfoBlockProps {
  downloadNoRemovals: ApplyDownload[]
  downloadEntries: ApplyDownload[]
  downloadApprovals: ApplyDownload[]
}

const AssetInfoBlock: React.FC<AssetInfoBlockProps> = ({
  downloadNoRemovals,
  downloadEntries,
  downloadApprovals,
}) => {
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
          <AssetInfoApplyDownload
            downloadNoRemovals={downloadNoRemovals}
          />
        </TabsContent>
        <TabsContent value="apply_list" className="flex-grow h-72 overflow-y-auto">
          <AssetInfoApplyList
            downloadEntries={downloadEntries}
          />
        </TabsContent>
        <TabsContent value="approval_list" className="flex-grow h-72 overflow-y-auto">
          <AssetInfoApprovalList
            downloadApprovals={downloadApprovals}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AssetInfoBlock