import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';

import Navbar from '@/components/navbar'

import '@/app/tailwind-globals.css'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session: Session | null = await getServerSession(authOptions)

  if (!session || !session?.user || !session?.user.name) {
    redirect('/sign-in');
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
