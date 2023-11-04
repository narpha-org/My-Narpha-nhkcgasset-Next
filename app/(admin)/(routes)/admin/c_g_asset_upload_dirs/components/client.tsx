"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, CGAssetUploadDirColumn } from "./columns";

interface CGAssetUploadDirClientProps {
  data: CGAssetUploadDirColumn[];
  paginatorInfo: PaginatorInfo;
}

export const CGAssetUploadDirClient: React.FC<CGAssetUploadDirClientProps> = ({
  data,
  paginatorInfo
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`アップロード場所 (${paginatorInfo.total})`} description="アップロード場所管理" />
        <Button onClick={() => router.push(`/admin/c_g_asset_upload_dirs/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="base_path" columns={columns} data={data} />
    </>
  );
};
