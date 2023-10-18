"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, CGAssetSearchAppProdColumn } from "./columns";

interface CGAssetSearchAppProdClientProps {
  data: CGAssetSearchAppProdColumn[];
  paginatorInfo: PaginatorInfo;
}

export const CGAssetSearchAppProdClient: React.FC<CGAssetSearchAppProdClientProps> = ({
  data,
  paginatorInfo
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`アセット検索項目: 制作ソフトウェア (${paginatorInfo.total})`} description="制作ソフトウェア管理" />
        <Button onClick={() => router.push(`/admin/c_g_asset_search_app_prods/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="desc" columns={columns} data={data} />
    </>
  );
};
