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
import { formatStatusApplyDownload } from "@/lib/enums";
// import { IsRoleUser } from "@/lib/check-role-client";

interface AssetInfoApplyListUserProps {
  applies: ApplyDownload[]
}

const AssetInfoApplyListUser: React.FC<AssetInfoApplyListUserProps> = ({
  applies,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

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
        {applies && applies.map((elem: ApplyDownload | null) => {
          if (elem) {
            return <TableRow key={elem.id}>
              <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
              <TableCell>{elem.cgAsset.asset_id}</TableCell>
              <TableCell>{elem.cgAsset.asset_name}</TableCell>
              <TableCell>{formatStatusApplyDownload(elem.status)}</TableCell>
            </TableRow>
          }

        })}
      </TableBody>
    </Table>
  )
}

export default AssetInfoApplyListUser