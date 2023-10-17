import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';

import AdminNavbar from '@/components/admin-navbar'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session: Session | null = await getServerSession(authOptions)

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
};
