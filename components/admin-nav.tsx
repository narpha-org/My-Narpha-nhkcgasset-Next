"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"
import { SearchItemToggle } from "./admin-search-item-toggle";
import { AssetItemToggle } from "./admin-asset-item-toggle";
import { SystemItemToggle } from "./admin-system-item-toggle";

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
      href: ``,
      label: 'SearchItemToggle',
    },
    {
      href: ``,
      label: 'AssetItemToggle',
    },
    {
      href: ``,
      label: 'SystemItemToggle',
    },
    {
      href: `/`,
      label: 'ユーザTOP',
      active: pathname === `/`,
    },
  ]

  return (
    <>
      <nav
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        {...props}
      >
        {routes.map((route) => {

          if (route.label === 'SearchItemToggle') {
            return <div key={route.label}><SearchItemToggle /></div>
          }
          if (route.label === 'AssetItemToggle') {
            return <div key={route.label}><AssetItemToggle /></div>
          }
          if (route.label === 'SystemItemToggle') {
            return <div key={route.label}><SystemItemToggle /></div>
          }

          return <Link
            key={route.href}
            href={route.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
            )}
          >
            {route.label}
          </Link>
        })}
      </nav>
    </>
  )
};
