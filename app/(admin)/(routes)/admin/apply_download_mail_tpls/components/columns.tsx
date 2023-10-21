"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  StatusApplyDownload,
} from "@/graphql/generated/graphql";

import { CellAction } from "./cell-action"

export type ApplyDownloadMailTplColumn = {
  id: string
  status: string; // 申請ステータス
  subject_tpl: string; // メール題名",
  body_tpl: string; // メール本文",
  from_mail: string; // 送信元メールアドレス",
  bcc_mail: string; // BCCメールアドレス",
  valid_flg: string;
}

export const columns: ColumnDef<ApplyDownloadMailTplColumn>[] = [
  {
    accessorKey: "status",
    header: "申請ステータス",
  },
  {
    accessorKey: "subject_tpl",
    header: "メール題名",
  },
  {
    accessorKey: "body_tpl",
    header: "メール本文",
  },
  {
    accessorKey: "from_mail",
    header: "送信元メールアドレス",
  },
  {
    accessorKey: "bcc_mail",
    header: "BCCメールアドレス",
  },
  {
    accessorKey: "valid_flg",
    header: "有効",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];

export const statusApplyDownloads: { key: StatusApplyDownload; value: string }[] = [
  {
    key: StatusApplyDownload.Apply,
    value: "申請"
  },
  {
    key: StatusApplyDownload.Approval,
    value: "承認"
  },
  {
    key: StatusApplyDownload.BoxDeliver,
    value: "Box送付"
  },
  {
    key: StatusApplyDownload.Removal,
    value: "消去"
  },
]

export const formatCode = (status: string) => {
  const obj = statusApplyDownloads.filter(statusApplyDownload => status === statusApplyDownload.key);
  if (obj && obj[0] && obj[0].key) {
    // return `${obj[0].key} (${obj[0].value})`;
    return `${obj[0].value}`;
  }
  return status;
}
