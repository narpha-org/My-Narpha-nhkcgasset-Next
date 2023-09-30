"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type UserRoleCgAssetStoreColumn = {
  id: string
  role: string;
  desc: string;
  valid_flg: string;
  created_at: string;
}

export const columns: ColumnDef<UserRoleCgAssetStoreColumn>[] = [
  {
    accessorKey: "role",
    header: "ユーザ種類",
  },
  {
    accessorKey: "desc",
    header: "CGアセットストアロール",
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

export const roleCGAssetStores = [
  {
    key: "ADMIN",
    value: "管理者"
  },
  {
    key: "MANAGER",
    value: "編集者"
  },
  {
    key: "USER",
    value: "一般ユーザ"
  },
]

export const formatRole = (role: string) => {
  const obj = roleCGAssetStores.filter(roleCGAssetStore => role === roleCGAssetStore.key);
  if (obj && obj[0] && obj[0].key) {
    return `${obj[0].key} (${obj[0].value})`;
  }
  return role;
}
