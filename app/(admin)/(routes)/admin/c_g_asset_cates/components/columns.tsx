"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type CGAssetCateColumn = {
  id: string
  code: string;
  desc: string;
  order: number;
  valid_flg: string;
  created_at: string;
}

export const columns: ColumnDef<CGAssetCateColumn>[] = [
  {
    accessorKey: "desc",
    header: "アセット種別表記",
  },
  {
    accessorKey: "code",
    header: "アセット区分",
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
