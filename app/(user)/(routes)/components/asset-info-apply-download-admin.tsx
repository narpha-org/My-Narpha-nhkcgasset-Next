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
import ApplyDownloadDialog from "./apply-download-dialog";

interface AssetInfoApplyDownloadAdminProps {
  downloadApplies: ApplyDownload[]
}

const AssetInfoApplyDownloadAdmin: React.FC<AssetInfoApplyDownloadAdminProps> = ({
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
          <TableHead>申請許可者</TableHead>
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
                action = "承認許可"
                break;
              case StatusApplyDownload.BoxDeliver: // Boxリンク通知
                action = "DL済み通知"
                break;
              case StatusApplyDownload.DlNotice: // DL済み通知
                action = "データ削除期限"
                break;
              case StatusApplyDownload.Removal: // データ削除期限
                action = "データ削除済み"
                break;
              default:
                break;
            }

            return <TableRow key={elem.id}>
              <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
              <TableCell>{elem.cgAsset.asset_id}</TableCell>
              <TableCell>{elem.cgAsset.asset_name}</TableCell>
              <TableCell>{elem.applyUser?.name}</TableCell>
              <TableCell>{elem.manageUser?.name}</TableCell>
              <TableCell>
                <ApplyDownloadDialog
                  cgAssetId={elem.cgAsset.id}
                  applyDownloadId={elem.id}
                  action={action}
                  variant="outline"
                />
              </TableCell>
            </TableRow>
          }

        })}
      </TableBody>
    </Table>
  )
}

export default AssetInfoApplyDownloadAdmin