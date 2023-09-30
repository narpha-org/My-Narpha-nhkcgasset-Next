"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, CGARegistrantAffiliationColumn } from "./columns";

interface CGARegistrantAffiliationClientProps {
  data: CGARegistrantAffiliationColumn[];
  paginatorInfo: PaginatorInfo;
}

export const CGARegistrantAffiliationClient: React.FC<CGARegistrantAffiliationClientProps> = ({
  data,
  paginatorInfo
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`登録者所属 (${paginatorInfo.total})`} description="登録者所属管理" />
        <Button onClick={() => router.push(`/c_g_a_registrant_affiliations/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="desc" columns={columns} data={data} />
    </>
  );
};
