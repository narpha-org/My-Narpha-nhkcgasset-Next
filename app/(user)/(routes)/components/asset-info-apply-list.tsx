"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { format } from 'date-fns'

import { Button } from "@/components/ui/button"
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
import { formatStatusApplyDownload } from "@/lib/enums";

interface AssetInfoApplyListProps {
  downloadEntries: ApplyDownload[]
}

const AssetInfoApplyList: React.FC<AssetInfoApplyListProps> = ({
  downloadEntries,
}) => {
  const router = useRouter();
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
          <TableHead className="">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {downloadEntries && downloadEntries.map((elem: ApplyDownload | null) => {

          if (elem) {

            let action = "次へ"
            switch (elem.status) {
              case StatusApplyDownload.Apply: // 申請中
                action = "承認通知"
                break;
              case StatusApplyDownload.Approval: // 承認済
                action = "Box送付通知"
                break;
              case StatusApplyDownload.BoxDeliver: // Box送付
                action = "消去通知"
                break;
              case StatusApplyDownload.Removal: // 消去
                action = "消去済"
                break;
              default:
                break;
            }

            return <TableRow key={elem.id}>
              <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
              <TableCell>{elem.cgAsset.asset_id}</TableCell>
              <TableCell>{elem.cgAsset.asset_name}</TableCell>
              <TableCell>{formatStatusApplyDownload(elem.status)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  disabled={loading}
                  className="ml-auto"
                  type="button"
                  onClick={() => router.push(`/c_g_assets/${elem.cgAsset.id}/apply-download/${elem.id}`)}
                >
                  {action}
                </Button>
              </TableCell>
            </TableRow>
          }

        })}
      </TableBody>
    </Table>
  )
}

export default AssetInfoApplyList