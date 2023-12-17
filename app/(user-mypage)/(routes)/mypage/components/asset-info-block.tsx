"use client";

import { useSession } from "next-auth/react";

import {
  ApplyDownload,
  ApplyDownloadPaginator,
  CgAsset,
  CgAssetPaginator
} from "@/graphql/generated/graphql";
import {
  IsRoleAdmin,
  IsRoleManager,
  IsRoleEditor
} from "@/lib/check-role-client";

import AssetInfoBlockAdmin from "./asset-info-block-admin";
import AssetInfoBlockManager from "./asset-info-block-manager";
import AssetInfoBlockEditor from "./asset-info-block-editor";
import AssetInfoBlockUser from "./asset-info-block-user";

interface AssetInfoBlockProps {
  downloadApplies: ApplyDownload[]
  downloadAppliesPg: ApplyDownloadPaginator['paginatorInfo']
  applies: ApplyDownload[]
  appliesPg: ApplyDownloadPaginator['paginatorInfo']
  approvals: ApplyDownload[]
  approvalsPg: ApplyDownloadPaginator['paginatorInfo']
  cgAssets: CgAsset[]
  cgAssetsPg: CgAssetPaginator['paginatorInfo']
}

const AssetInfoBlock: React.FC<AssetInfoBlockProps> = ({
  downloadApplies,
  downloadAppliesPg,
  applies,
  appliesPg,
  approvals,
  approvalsPg,
  cgAssets,
  cgAssetsPg,
}) => {
  const { data: session, status } = useSession();

  if (IsRoleAdmin(session)) {
    return <AssetInfoBlockAdmin
      downloadApplies={downloadApplies}
      downloadAppliesPg={downloadAppliesPg}
      applies={applies}
      appliesPg={appliesPg}
      approvals={approvals}
      approvalsPg={approvalsPg}
      cgAssets={cgAssets}
      cgAssetsPg={cgAssetsPg}
    />
  }

  if (IsRoleManager(session)) {
    return <AssetInfoBlockManager
      downloadApplies={downloadApplies}
      downloadAppliesPg={downloadAppliesPg}
      applies={applies}
      appliesPg={appliesPg}
      approvals={approvals}
      approvalsPg={approvalsPg}
      cgAssets={cgAssets}
      cgAssetsPg={cgAssetsPg}
    />
  }

  if (IsRoleEditor(session)) {
    return <AssetInfoBlockEditor
      downloadApplies={downloadApplies}
      downloadAppliesPg={downloadAppliesPg}
      applies={applies}
      appliesPg={appliesPg}
      approvals={approvals}
      approvalsPg={approvalsPg}
      cgAssets={cgAssets}
      cgAssetsPg={cgAssetsPg}
    />
  }

  return <AssetInfoBlockUser
    downloadApplies={downloadApplies}
    downloadAppliesPg={downloadAppliesPg}
    applies={applies}
    appliesPg={appliesPg}
    approvals={approvals}
    approvalsPg={approvalsPg}
  />
}

export default AssetInfoBlock