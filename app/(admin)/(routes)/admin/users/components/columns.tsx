"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type UserColumn = {
  id: string
  name: string;
  email: string;
  registAffili: string;
  regist_affili_code: string;
  userRole: string;
  created_at: string;
}

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "name",
    header: "Oktaユーザ名",
  },
  {
    accessorKey: "email",
    header: "メールアドレス",
  },
  {
    accessorKey: "registAffili",
    header: "主所属名",
  },
  {
    accessorKey: "regist_affili_code",
    header: "主所属コード",
  },
  {
    accessorKey: "userRole",
    header: "CGアセットストア ロール",
  },
  {
    accessorKey: "created_at",
    header: "作成日時",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
