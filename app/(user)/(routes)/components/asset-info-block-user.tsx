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
} from "@/graphql/generated/graphql";

import AssetInfoApplyDownloadUser from "./asset-info-apply-download-user";
import AssetInfoApplyListUser from "./asset-info-apply-list-user";
import AssetInfoApprovalListUser from "./asset-info-approval-list-user";

interface AssetInfoBlockUserProps {
  downloadApplies: ApplyDownload[]
  downloadAppliesPg: ApplyDownloadPaginator['paginatorInfo']
  applies: ApplyDownload[]
  appliesPg: ApplyDownloadPaginator['paginatorInfo']
  approvals: ApplyDownload[]
  approvalsPg: ApplyDownloadPaginator['paginatorInfo']
}

const AssetInfoBlockUser: React.FC<AssetInfoBlockUserProps> = ({
  downloadApplies,
  downloadAppliesPg,
  applies,
  appliesPg,
  approvals,
  approvalsPg,
}) => {
  const router = useRouter();

  const [searchTxt, setSearchTxt] = useState('');
  const [selectedTab, setSelectedTab] = useState('apply_download');

  const assetInfoApplyDownloadUserRef = useRef<{ handleSearch(txt: string): void } | undefined>();
  const assetInfoApplyListUserRef = useRef<{ handleSearch(txt: string): void } | undefined>();
  const assetInfoApprovalListUserRef = useRef<{ handleSearch(txt: string): void } | undefined>();

  const handleSearch = () => {
    switch (selectedTab) {
      case 'apply_download':
        assetInfoApplyDownloadUserRef?.current?.handleSearch(searchTxt)
        break;
      case 'apply_list':
        assetInfoApplyListUserRef?.current?.handleSearch(searchTxt)
        break;
      case 'approval_list':
        assetInfoApprovalListUserRef?.current?.handleSearch(searchTxt)
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
      </div>
      <Tabs defaultValue="apply_download" className="flex flex-col w-full basis-2/3">
        <TabsList>
          <TabsTrigger value="apply_download" onClick={() => setSelectedTab('apply_download')}>ダウンロード申請</TabsTrigger>
          <TabsTrigger value="apply_list" onClick={() => setSelectedTab('apply_list')}>申請一覧</TabsTrigger>
          <TabsTrigger value="approval_list" onClick={() => setSelectedTab('approval_list')}>承認一覧</TabsTrigger>
        </TabsList>
        <TabsContent value="apply_download" className="flex-grow h-full overflow-y-auto">
          <AssetInfoApplyDownloadUser
            searchRef={assetInfoApplyDownloadUserRef}
            downloadApplies={downloadApplies}
            downloadAppliesPg={downloadAppliesPg}
          />
        </TabsContent>
        <TabsContent value="apply_list" className="flex-grow h-full overflow-y-auto">
          <AssetInfoApplyListUser
            searchRef={assetInfoApplyListUserRef}
            applies={applies}
            appliesPg={appliesPg}
          />
        </TabsContent>
        <TabsContent value="approval_list" className="flex-grow h-full overflow-y-auto">
          <AssetInfoApprovalListUser
            searchRef={assetInfoApprovalListUserRef}
            approvals={approvals}
            approvalsPg={approvalsPg}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AssetInfoBlockUser