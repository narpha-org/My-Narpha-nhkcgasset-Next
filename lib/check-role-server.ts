import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { RoleCgAssetStore } from "@/graphql/generated/graphql";

export async function isServerRoleAdmin() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session?.user || !session?.user.name) {
    return false;
  }

  if (
    (session?.user as unknown as { role: string }).role ===
    RoleCgAssetStore.Admin
  ) {
    return true;
  }

  return false;
}

export async function isServerRoleManager() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session?.user || !session?.user.name) {
    return false;
  }

  if (
    (session?.user as unknown as { role: string }).role ===
    RoleCgAssetStore.Manager
  ) {
    return true;
  }

  return false;
}

export async function isServerRoleUser() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session?.user || !session?.user.name) {
    return false;
  }

  if (
    (session?.user as unknown as { role: string }).role ===
    RoleCgAssetStore.User
  ) {
    return true;
  }

  return false;
}
