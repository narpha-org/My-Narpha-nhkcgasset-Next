"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, CGaBroadcastingRightColumn } from "./columns";

interface CGaBroadcastingRightClientProps {
  data: CGaBroadcastingRightColumn[];
  paginatorInfo: PaginatorInfo;
}

export const CGaBroadcastingRightClient: React.FC<CGaBroadcastingRightClientProps> = ({
  data,
  paginatorInfo
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`放送権利 (${paginatorInfo.total})`} description="放送権利管理" />
        <Button onClick={() => router.push(`/c_g_a_broadcasting_rights/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="desc" columns={columns} data={data} />
    </>
  );
};
