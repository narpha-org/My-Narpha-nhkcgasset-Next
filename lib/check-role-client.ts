"use client";

// import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { RoleCgAssetStore } from "@/graphql/generated/graphql";

export const IsRoleAdmin = (session: Session | null) => {
  // const { data: session, status } = useSession();

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
};

export const IsRoleManager = (session: Session | null) => {
  // const { data: session, status } = useSession();

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
};

export const IsRoleEditor = (session: Session | null) => {
  // const { data: session, status } = useSession();

  if (!session || !session?.user || !session?.user.name) {
    return false;
  }

  if (
    (session?.user as unknown as { role: string }).role ===
    RoleCgAssetStore.Editor
  ) {
    return true;
  }

  return false;
};

export const IsRoleUser = (session: Session | null) => {
  // const { data: session, status } = useSession();

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
};

export const IsRoleOther = (session: Session | null) => {
  // const { data: session, status } = useSession();

  if (!session || !session?.user || !session?.user.name) {
    return false;
  }

  if (
    (session?.user as unknown as { role: string }).role ===
    RoleCgAssetStore.Other
  ) {
    return true;
  }

  return false;
};
