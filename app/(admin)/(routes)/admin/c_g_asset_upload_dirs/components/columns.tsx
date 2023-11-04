"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type CGAssetUploadDirColumn = {
  id: string
  base_path: string;
  order: number;
  valid_flg: string;
  created_at: string;
}

export const columns: ColumnDef<CGAssetUploadDirColumn>[] = [
  {
    accessorKey: "base_path",
    header: "アップロード場所",
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
