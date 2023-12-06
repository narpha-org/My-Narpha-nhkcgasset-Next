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
} from "@/graphql/generated/graphql";

import AssetInfoApplyDownloadUser from "./asset-info-apply-download-user";
// import AssetInfoApplyListUser from "./asset-info-apply-list-user";
// import AssetInfoApprovalListUser from "./asset-info-approval-list-user";

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
  // const router = useRouter();

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
          <AssetInfoApplyDownloadUser
            searchRef={assetInfoApplyDownloadUserRef}
            downloadApplies={downloadApplies}
            downloadAppliesPg={downloadAppliesPg}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AssetInfoBlockUser