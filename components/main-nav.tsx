"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
// import { RoleCgAssetStore } from "@/graphql/generated/graphql";
import { IsRoleAdmin } from "@/lib/check-role-client";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const { data: session, status } = useSession()

  const routes = [
    {
      href: `/mypage`,
      label: 'HOME',
      active: pathname === `/mypage`,
    },
    {
      href: `/`,
      label: 'CGアセット',
      active: pathname === `/`,
    },
  ]

  if (IsRoleAdmin(session)) {
    routes.push({
      href: `/admin/`,
      label: '管理TOP',
      active: pathname === `/admin/`,
    });
  }
  // if (session?.user && (session?.user as unknown as { role: string }).role === RoleCgAssetStore.Admin) {
  //   routes.push({
  //     href: `/admin/`,
  //     label: '管理TOP',
  //     active: pathname === `/admin/`,
  //   });
  // }

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
