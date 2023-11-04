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

interface AssetInfoApprovalListUserProps {
  approvals: ApplyDownload[]
}

const AssetInfoApprovalListUser: React.FC<AssetInfoApprovalListUserProps> = ({
  approvals,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <Table>
      <TableCaption>承認一覧</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>Asset ID</TableHead>
          <TableHead>Asset Name</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {approvals && approvals.map((elem: ApplyDownload | null) => {

          if (elem) {

            let action = "次へ"
            switch (elem.status) {
              case StatusApplyDownload.Apply: // 申請中
                action = "承認待ち"

                return <TableRow key={elem.id}>
                  <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
                  <TableCell>{elem.cgAsset.asset_id}</TableCell>
                  <TableCell>{elem.cgAsset.asset_name}</TableCell>
                  <TableCell>
                    {action}
                  </TableCell>
                </TableRow>

              case StatusApplyDownload.Approval: // 承認済
                action = "承認済み"

                return <TableRow key={elem.id}>
                  <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
                  <TableCell>{elem.cgAsset.asset_id}</TableCell>
                  <TableCell>{elem.cgAsset.asset_name}</TableCell>
                  <TableCell>
                    {action}
                  </TableCell>
                </TableRow>

                break;
              case StatusApplyDownload.BoxDeliver: // Boxリンク通知
                action = "ダウンロード"
                break;
              case StatusApplyDownload.DlNotice: // DL済み通知
                action = "データ消去報告"
                break;
              case StatusApplyDownload.Removal: // データ削除期限
                action = "データ消去報告"
                break;
              default:
                break;
            }

            return <TableRow key={elem.id}>
              <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
              <TableCell>{elem.cgAsset.asset_id}</TableCell>
              <TableCell>{elem.cgAsset.asset_name}</TableCell>
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

export default AssetInfoApprovalListUser