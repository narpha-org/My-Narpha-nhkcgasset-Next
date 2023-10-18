"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, CGASharedAreaColumn } from "./columns";

interface CGASharedAreaClientProps {
  data: CGASharedAreaColumn[];
  paginatorInfo: PaginatorInfo;
}

export const CGASharedAreaClient: React.FC<CGASharedAreaClientProps> = ({
  data,
  paginatorInfo
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`公開エリア (${paginatorInfo.total})`} description="公開エリア管理" />
        <Button onClick={() => router.push(`/admin/c_g_a_shared_areas/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="desc" columns={columns} data={data} />
    </>
  );
};
