"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  CodeCgAssetCate,
} from "@/graphql/generated/graphql";

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

export const codeCGAssetCates: { key: CodeCgAssetCate; value: string }[] = [
  {
    key: CodeCgAssetCate.C3D,
    value: "3Dタグ"
  },
  {
    key: CodeCgAssetCate.C2D,
    value: "2Dタグ"
  },
  {
    key: CodeCgAssetCate.Img,
    value: "-タグ非表示-"
  },
]

export const formatCode = (role: string) => {
  const obj = codeCGAssetCates.filter(codeCGAssetCate => role === codeCGAssetCate.key);
  if (obj && obj[0] && obj[0].key) {
    return `${obj[0].key} (${obj[0].value})`;
  }
  return role;
}
