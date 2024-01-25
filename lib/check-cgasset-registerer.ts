import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import {
  CgAsset,
  CodeCgaViewingRestriction,
} from "@/graphql/generated/graphql";

export const checkCgAssetRegisterer = async (cgAsset: CgAsset | null) => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session?.user || !session?.user.name) {
    return 0;
  }

  if (!cgAsset) {
    return 0;
  }

  if (
    cgAsset.viewingRestriction?.code !==
    CodeCgaViewingRestriction.RegistererOnly
  ) {
    return 1;
  }

  if (
    cgAsset.viewingRestriction?.code ===
      CodeCgaViewingRestriction.RegistererOnly &&
    (session?.user as { userId: string }).userId === cgAsset.userCreate.id
  ) {
    return 1;
  }

  return 0;
};
