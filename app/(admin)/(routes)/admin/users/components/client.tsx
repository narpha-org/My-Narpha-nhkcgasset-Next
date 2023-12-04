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
        <Heading title={`[閲覧のみ] Oktaユーザ (${paginatorInfo.total})`} description="本システムにログインし保存済のOktaユーザ情報を閲覧<br />レコード更新／削除しても該当ユーザが再度Okta認証する際にOkta側の登録Profileで上書きされます。<br />情報管理はOkta側で行なって下さい。" />
      </div>
      <Separator />
      <DataTableEx columns={columns} data={data} />
    </>
  );
};
