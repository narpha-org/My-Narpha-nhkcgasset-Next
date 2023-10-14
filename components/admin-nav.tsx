"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function AdminNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/admin/`,
      label: '管理ダッシュボード',
      active: pathname === `/admin/`,
    },
    {
      href: `/admin/users`,
      label: 'Oktaユーザ',
      active: pathname === `/admin/users`,
    },
    {
      href: `/admin/user_role_c_g_asset_stores`,
      label: 'CGアセットストアロール',
      active: pathname === `/admin/user_role_c_g_asset_stores`,
    },
    {
      href: `/admin/c_g_asset_cates`,
      label: 'アセット種別',
      active: pathname === `/admin/c_g_asset_cates`,
    },
    {
      href: `/admin/c_g_a_registrant_affiliations`,
      label: '登録者所属',
      active: pathname === `/admin/c_g_a_registrant_affiliations`,
    },
    {
      href: `/admin/c_g_a_viewing_restrictions`,
      label: '閲覧制限',
      active: pathname === `/admin/c_g_a_viewing_restrictions`,
    },
    {
      href: `/admin/c_g_a_broadcasting_rights`,
      label: '放送権利',
      active: pathname === `/admin/c_g_a_broadcasting_rights`,
    },
    {
      href: `/admin/c_g_a_shared_areas`,
      label: '公開エリア',
      active: pathname === `/admin/c_g_a_shared_areas`,
    },
    {
      href: `/`,
      label: 'TOP',
      active: pathname === `/`,
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
};
