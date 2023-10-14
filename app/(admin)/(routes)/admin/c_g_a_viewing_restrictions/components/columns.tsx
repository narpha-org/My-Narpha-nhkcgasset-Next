"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type CGAViewingRestrictionColumn = {
  id: string
  desc: string;
  valid_flg: string;
  created_at: string;
}

export const columns: ColumnDef<CGAViewingRestrictionColumn>[] = [
  {
    accessorKey: "desc",
    header: "閲覧制限",
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
