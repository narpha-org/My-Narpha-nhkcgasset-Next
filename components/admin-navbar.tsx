import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
// import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/auth-buttons";

const AdminNavbar = async () => {
  const session: Session | null = await getServerSession(authOptions)

  if (!session || !session?.user || !session?.user.name) {
    redirect('/sign-in');
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <AdminNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          {/* <ThemeToggle /> */}
          <LogoutButton session={session} />
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
