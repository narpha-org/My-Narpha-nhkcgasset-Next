"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type CGAssetCateColumn = {
  id: string
  desc: string;
  valid_flg: string;
  created_at: string;
}

export const columns: ColumnDef<CGAssetCateColumn>[] = [
  {
    accessorKey: "desc",
    header: "アセット種別",
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
