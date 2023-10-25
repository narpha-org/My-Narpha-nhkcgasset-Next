"use client";

import { useParams, useRouter } from "next/navigation";

import { DataTableEx } from "@/components/ui/data-table-ex";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, UserColumn } from "./columns";

interface UserClientProps {
  data: UserColumn[];
  paginatorInfo: PaginatorInfo;
}

export const UserClient: React.FC<UserClientProps> = ({
  data,
  paginatorInfo
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`ログイン済Oktaユーザ (${paginatorInfo.total})`} description="本システムにログインし保存済のOktaユーザ情報を管理" />
      </div>
      <Separator />
      <DataTableEx columns={columns} data={data} />
    </>
  );
};
