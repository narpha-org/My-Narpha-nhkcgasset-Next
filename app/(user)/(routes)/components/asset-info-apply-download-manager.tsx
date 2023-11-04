"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { format } from 'date-fns'

// import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApplyDownload, StatusApplyDownload } from "@/graphql/generated/graphql";
// import { formatStatusApplyDownload } from "@/lib/enums";
// import { Router } from "next/router";

interface AssetInfoApplyDownloadManagerProps {
  downloadApplies: ApplyDownload[]
}

const AssetInfoApplyDownloadManager: React.FC<AssetInfoApplyDownloadManagerProps> = ({
  downloadApplies,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <Table>
      <TableCaption>ダウンロード申請</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>Asset ID</TableHead>
          <TableHead>Asset Name</TableHead>
          <TableHead>申請者</TableHead>
          <TableHead className="">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {downloadApplies && downloadApplies.map((elem: ApplyDownload | null) => {

          if (elem) {

            let action = "-次へ-"
            switch (elem.status) {
              case StatusApplyDownload.Apply: // 申請中
                action = "申請中"
                break;
              case StatusApplyDownload.Approval: // 承認済
                action = "承認済み"
                break;
              case StatusApplyDownload.BoxDeliver: // DL済み通知
                action = "送付済み"
                break;
              case StatusApplyDownload.DlNotice: // DL済み通知
                action = "DL済み通知"
                break;
              case StatusApplyDownload.Removal: // データ削除期限
                action = "データ削除期限"
                break;
              default:
                break;
            }

            return <TableRow key={elem.id}>
              <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
              <TableCell>{elem.cgAsset.asset_id}</TableCell>
              <TableCell>{elem.cgAsset.asset_name}</TableCell>
              <TableCell>{elem.applyUser?.name}</TableCell>
              <TableCell>
                {action}
              </TableCell>
            </TableRow>
          }

        })}
      </TableBody>
    </Table>
  )
}

export default AssetInfoApplyDownloadManager