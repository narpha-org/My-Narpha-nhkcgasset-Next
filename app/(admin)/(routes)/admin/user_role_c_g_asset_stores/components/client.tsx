"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatorInfo } from "@/graphql/generated/graphql";

import { columns, UserRoleCgAssetStoreColumn, formatRole } from "./columns";

interface UserRoleCgAssetStoreClientProps {
  data: UserRoleCgAssetStoreColumn[];
  paginatorInfo: PaginatorInfo;
}

export const UserRoleCgAssetStoreClient: React.FC<UserRoleCgAssetStoreClientProps> = ({
  data,
  paginatorInfo
}) => {
  const params = useParams();
  const router = useRouter();

  data.map(elem => {
    elem.role = formatRole(elem.role)
  })

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`[Okta Profile項目] CGアセットストアロール (${paginatorInfo.total})`} description="CGアセットストアロール管理<br />Okta Profile項目: user.cgAssetStoreRoleDesc と完全一致でOktaログインユーザに適用" />
        <Button onClick={() => router.push(`/admin/user_role_c_g_asset_stores/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 新規追加
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="desc" columns={columns} data={data} />
    </>
  );
};
