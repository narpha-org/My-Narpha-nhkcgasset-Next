import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';

import AdminNavbar from '@/components/admin-navbar'
// import { RoleCgAssetStore } from "@/graphql/generated/graphql";
import AdminUnauthorized from "./admin-unauthorized";
import { isServerRoleAdmin } from "@/lib/check-role-server";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session: Session | null = await getServerSession(authOptions)

  if (!session || !session?.user || !session?.user.name) {
    redirect('/sign-in');
  }

  if (await isServerRoleAdmin() === false) {
    return <AdminUnauthorized />;
  }
  // if ((session?.user as unknown as { role: string }).role !== RoleCgAssetStore.Admin) {
  //   return <AdminUnauthorized />;
  // }

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
};
