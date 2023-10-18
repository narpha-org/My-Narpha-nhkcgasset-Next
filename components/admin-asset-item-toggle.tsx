"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AssetItemToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const active = [
    `/admin/user_role_c_g_asset_stores`,
    `/admin/c_g_a_registrant_affiliations`,
    `/admin/c_g_a_viewing_restrictions`,
    `/admin/c_g_a_broadcasting_rights`,
    `/admin/c_g_a_shared_areas`,
  ].includes(pathname)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default" className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          active ? 'text-black dark:text-white' : 'text-muted-foreground'
        )}>
          <span className="">アセット詳細項目</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/admin/user_role_c_g_asset_stores`)}>
          CGアセットストアロール
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/c_g_a_registrant_affiliations`)}>
          登録者所属
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/c_g_a_viewing_restrictions`)}>
          閲覧制限
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/c_g_a_broadcasting_rights`)}>
          放送権利
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/c_g_a_shared_areas`)}>
          公開エリア
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

