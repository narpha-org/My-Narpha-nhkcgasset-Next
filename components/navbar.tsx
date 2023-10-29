import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/auth-buttons";

const Navbar = async () => {
  const session: Session | null = await getServerSession(authOptions)

  if (!session || !session?.user || !session?.user.name) {
    redirect('/sign-in');
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <LogoutButton session={session} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
