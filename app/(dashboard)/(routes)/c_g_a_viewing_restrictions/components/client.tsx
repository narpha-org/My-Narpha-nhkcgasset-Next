"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, CGAViewingRestrictionColumn } from "./columns";

interface CGAViewingRestrictionClientProps {
  data: CGAViewingRestrictionColumn[];
  paginatorInfo: PaginatorInfo;
}

export const CGAViewingRestrictionClient: React.FC<CGAViewingRestrictionClientProps> = ({
  data,
  paginatorInfo
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`閲覧制限 (${paginatorInfo.total})`} description="閲覧制限管理" />
        <Button onClick={() => router.push(`/c_g_a_viewing_restrictions/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="desc" columns={columns} data={data} />
    </>
  );
};
