"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, CGAssetCateColumn } from "./columns";
import { formatCodeCGAssetCate } from "@/lib/enums"

interface CGAssetCateClientProps {
  data: CGAssetCateColumn[];
  paginatorInfo: PaginatorInfo;
}

export const CGAssetCateClient: React.FC<CGAssetCateClientProps> = ({
  data,
  paginatorInfo
}) => {
  const router = useRouter();

  data.map(elem => {
    elem.code = formatCodeCGAssetCate(elem.code)
  })

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`アセット検索項目: 種別 (${paginatorInfo.total})`} description="アセット種別管理" />
        <Button onClick={() => router.push(`/admin/c_g_asset_cates/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="desc" columns={columns} data={data} />
    </>
  );
};
