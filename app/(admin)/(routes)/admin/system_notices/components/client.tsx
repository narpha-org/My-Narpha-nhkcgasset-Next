"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, SystemNoticeColumn } from "./columns";

interface SystemNoticeClientProps {
  data: SystemNoticeColumn[];
  paginatorInfo: PaginatorInfo;
}

export const SystemNoticeClient: React.FC<SystemNoticeClientProps> = ({
  data,
  paginatorInfo
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`ホーム画面: お知らせ (${paginatorInfo.total})`} description="お知らせ管理" />
        <Button onClick={() => router.push(`/admin/system_notices/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="message" columns={columns} data={data} />
    </>
  );
};
