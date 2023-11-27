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

export function SystemItemToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const active = [
    `/admin/system_notices`,
    `/admin/system_mail_templates`,
    `/admin/user_role_c_g_asset_stores`,
    `/admin/c_g_a_registrant_affiliations`,
    `/admin/users`,
    `/admin/bulk_registration`,
    `/admin/bulk_export`,
  ].includes(pathname)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default" className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          active ? 'text-black dark:text-white' : 'text-muted-foreground'
        )}>
          <span className="">システム管理項目</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/admin/system_notices`)}>
          お知らせ
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/system_mail_templates`)}>
          メール雛形
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/user_role_c_g_asset_stores`)}>
          [Okta Profile項目] CGアセットストアロール
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/c_g_a_registrant_affiliations`)}>
          [Okta Profile項目] 登録者所属
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/users`)}>
          [閲覧のみ] Oktaユーザ
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/bulk_registration`)}>
          CGアセット データ一括登録
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/bulk_export`)}>
          CGアセット データエクスポート
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

