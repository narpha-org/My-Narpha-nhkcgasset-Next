"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
// import { IsRoleUser } from "@/lib/check-role-client";

import ApplyDownloadDialog from "./apply-download-dialog";

interface AssetInfoApplyListManagerProps {
  applies: ApplyDownload[]
}

const AssetInfoApplyListManager: React.FC<AssetInfoApplyListManagerProps> = ({
  applies,
}) => {
  // const router = useRouter();
  // const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <Table>
      <TableCaption>申請一覧</TableCaption>
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
        {applies && applies.map((elem: ApplyDownload | null) => {

          if (elem) {

            let action = "次へ"
            switch (elem.status) {
              case StatusApplyDownload.Apply: // 申請中
                action = "承認"
                break;
              case StatusApplyDownload.Approval: // 承認済
                action = "-Box送付通知-"
                break;
              case StatusApplyDownload.BoxDeliver: // Boxリンク通知
                action = "-DL済み通知-"
                break;
              case StatusApplyDownload.DlNotice: // DL済み通知
                action = "-消去通知-"
                break;
              case StatusApplyDownload.Removal: // データ削除期限
                action = "-消去済-"
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
                <ApplyDownloadDialog
                  cgAssetId={elem.cgAsset.id}
                  applyDownloadId={elem.id}
                  action={action}
                  variant="default"
                />
              </TableCell>
            </TableRow>
          }

        })}
      </TableBody>
    </Table>
  )
}

export default AssetInfoApplyListManager