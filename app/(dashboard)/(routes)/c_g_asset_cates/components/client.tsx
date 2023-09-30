"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, CGAssetCateColumn } from "./columns";

interface CGAssetCateClientProps {
  data: CGAssetCateColumn[];
  paginatorInfo: PaginatorInfo;
}

export const CGAssetCateClient: React.FC<CGAssetCateClientProps> = ({
  data,
  paginatorInfo
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`アセット種別 (${paginatorInfo.total})`} description="アセット種別管理" />
        <Button onClick={() => router.push(`/c_g_asset_cates/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="desc" columns={columns} data={data} />
    </>
  );
};
