"use client";

import { useSession } from "next-auth/react";

import { ApplyDownload, CgAsset } from "@/graphql/generated/graphql";
import { IsRoleAdmin, IsRoleManager } from "@/lib/check-role-client";

import AssetInfoBlockAdmin from "./asset-info-block-admin";
import AssetInfoBlockManager from "./asset-info-block-manager";
import AssetInfoBlockUser from "./asset-info-block-user";

interface AssetInfoBlockProps {
  downloadApplies: ApplyDownload[]
  applies: ApplyDownload[]
  approvals: ApplyDownload[]
  cgAssets: CgAsset[]
}

const AssetInfoBlock: React.FC<AssetInfoBlockProps> = ({
  downloadApplies,
  applies,
  approvals,
  cgAssets,
}) => {
  const { data: session, status } = useSession();

  if (IsRoleAdmin(session)) {
    return <AssetInfoBlockAdmin
      downloadApplies={downloadApplies}
      applies={applies}
      approvals={approvals}
      cgAssets={cgAssets}
    />
  }

  if (IsRoleManager(session)) {
    return <AssetInfoBlockManager
      downloadApplies={downloadApplies}
      applies={applies}
      approvals={approvals}
      cgAssets={cgAssets}
    />
  }

  return <AssetInfoBlockUser
    downloadApplies={downloadApplies}
    applies={applies}
    approvals={approvals}
  />
}

export default AssetInfoBlock