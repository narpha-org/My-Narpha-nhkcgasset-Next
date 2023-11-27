"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  CodeMailTemplate,
} from "@/graphql/generated/graphql";

import { CellAction } from "./cell-action"

export type SystemMailTemplateColumn = {
  id: string
  code: string; // メール区分
  subject_tpl: string; // メール題名",
  body_tpl: string; // メール本文",
  from_mail: string; // 送信元メールアドレス",
  bcc_mail: string; // BCCメールアドレス",
  valid_flg: string;
}

export const columns: ColumnDef<SystemMailTemplateColumn>[] = [
  {
    accessorKey: "code",
    header: "メール区分",
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

export const codeMailTemplates: { key: CodeMailTemplate; value: string }[] = [
  {
    key: CodeMailTemplate.ApplyDownloadApply,
    value: "ダウンロード申請"
  },
  {
    key: CodeMailTemplate.ApplyDownloadApproval,
    value: "ダウンロード承認許可"
  },
  {
    key: CodeMailTemplate.ApplyDownloadBoxDeliver,
    value: "ダウンロードBoxリンクご用意中"
  },
  {
    key: CodeMailTemplate.ApplyDownloadBoxReady,
    value: "ダウンロードBoxリンク準備完了"
  },
  {
    key: CodeMailTemplate.ApplyDownloadDlNotice,
    value: "ダウンロード済み通知"
  },
  {
    key: CodeMailTemplate.ApplyDownloadRemoval,
    value: "ダウンロードBoxデータ削除期限通知"
  },
  {
    key: CodeMailTemplate.ApplyDownloadDone,
    value: "ダウンロードBoxデータ削除通知"
  },
  {
    key: CodeMailTemplate.AssetComment,
    value: "アセットに対するコメントの通知"
  },
  {
    key: CodeMailTemplate.AssetDeleteConfirm,
    value: "（未使用）アセット削除確認"
  },
  {
    key: CodeMailTemplate.RemovalAlert,
    value: "（未使用）放送後のデータ削除アラート"
  },
  {
    key: CodeMailTemplate.PendingList,
    value: "（未使用）管理者あて未決リスト"
  },
  {
    key: CodeMailTemplate.AdminComment,
    value: "（未使用）管理者へコメント"
  },
]

export const formatCode = (code: string) => {
  const obj = codeMailTemplates.filter(codeMailTemplate => code === codeMailTemplate.key);
  if (obj && obj[0] && obj[0].key) {
    // return `${obj[0].key} (${obj[0].value})`;
    return `${obj[0].value}`;
  }
  return code;
}
