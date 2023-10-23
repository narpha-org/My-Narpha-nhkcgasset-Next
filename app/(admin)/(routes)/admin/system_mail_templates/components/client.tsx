"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, SystemMailTemplateColumn, formatCode } from "./columns";

interface SystemMailTemplateClientProps {
  data: SystemMailTemplateColumn[];
  paginatorInfo: PaginatorInfo;
}

export const SystemMailTemplateClient: React.FC<SystemMailTemplateClientProps> = ({
  data,
  paginatorInfo
}) => {
  const router = useRouter();

  data.map(elem => {
    elem.code = formatCode(elem.code)
  })

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`ホーム画面: メールテンプレート (${paginatorInfo.total})`} description="メールテンプレート管理" />
        <Button onClick={() => router.push(`/admin/system_mail_templates/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="body_tpl" columns={columns} data={data} />
    </>
  );
};
