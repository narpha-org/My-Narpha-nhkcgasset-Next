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

export function SearchItemToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const active = [
    `/admin/c_g_asset_cates`,
    `/admin/c_g_asset_search_tags`,
    `/admin/c_g_asset_search_app_prods`,
  ].includes(pathname)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default" className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          active ? 'text-black dark:text-white' : 'text-muted-foreground'
        )}>
          <span className="">アセット検索項目</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/admin/c_g_asset_cates`)}>
          アセット種別
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/c_g_asset_search_tags`)}>
          ジャンル
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/c_g_asset_search_app_prods`)}>
          制作ソフトウェア
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

