"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, ApplyDownloadMailTplColumn, formatCode } from "./columns";

interface ApplyDownloadMailTplClientProps {
  data: ApplyDownloadMailTplColumn[];
  paginatorInfo: PaginatorInfo;
}

export const ApplyDownloadMailTplClient: React.FC<ApplyDownloadMailTplClientProps> = ({
  data,
  paginatorInfo
}) => {
  const router = useRouter();

  data.map(elem => {
    elem.status = formatCode(elem.status)
  })

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`ホーム画面: 申請メールテンプレート (${paginatorInfo.total})`} description="申請メールテンプレート管理" />
        <Button onClick={() => router.push(`/admin/apply_download_mail_tpls/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="body_tpl" columns={columns} data={data} />
    </>
  );
};
