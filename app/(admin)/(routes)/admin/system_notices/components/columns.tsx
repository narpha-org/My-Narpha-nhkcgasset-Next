"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type SystemNoticeColumn = {
  id: string
  message: string;
  notice_date: string;
  valid_flg: string;
}

export const columns: ColumnDef<SystemNoticeColumn>[] = [
  {
    accessorKey: "message",
    header: "お知らせ",
  },
  {
    accessorKey: "notice_date",
    header: "お知らせ日時",
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
