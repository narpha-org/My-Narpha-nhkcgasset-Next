"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type SystemNoticeColumn = {
  id: string
  message: string;
  order: number;
  valid_flg: string;
  created_at: string;
}

export const columns: ColumnDef<SystemNoticeColumn>[] = [
  {
    accessorKey: "message",
    header: "お知らせ",
  },
  {
    accessorKey: "order",
    header: "表示順",
  },
  {
    accessorKey: "valid_flg",
    header: "有効",
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
