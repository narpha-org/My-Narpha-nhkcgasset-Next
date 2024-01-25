import {
  CodeCgAssetCate,
  CodeCgaViewingRestriction,
  StatusApplyDownload,
} from "@/graphql/generated/graphql";

export const codeCGAssetCates: { key: CodeCgAssetCate; value: string }[] = [
  {
    key: CodeCgAssetCate.C3D,
    value: "3DCGタグ",
  },
  {
    key: CodeCgAssetCate.C2D,
    value: "動画タグ",
  },
  {
    key: CodeCgAssetCate.Img,
    value: "静止画タグ",
  },
];

export const formatCodeCGAssetCate = (role: string) => {
  const obj = codeCGAssetCates.filter(
    (codeCGAssetCate) => role === codeCGAssetCate.key
  );
  if (obj && obj[0] && obj[0].key) {
    return `${obj[0].key} (${obj[0].value})`;
  }
  return role;
};

export const codeCGAViewingRestrictions: {
  key: CodeCgaViewingRestriction;
  value: string;
}[] = [
  {
    key: CodeCgaViewingRestriction.NoLimit,
    value: "制限なし",
  },
  {
    key: CodeCgaViewingRestriction.GroupOnly,
    value: "グループのみ",
  },
  {
    key: CodeCgaViewingRestriction.RegistererOnly,
    value: "登録者のみ",
  },
];

export const formatCodeCGAViewingRestriction = (role: string) => {
  const obj = codeCGAViewingRestrictions.filter(
    (codeCGAViewingRestriction) => role === codeCGAViewingRestriction.key
  );
  if (obj && obj[0] && obj[0].key) {
    return `${obj[0].key} (${obj[0].value})`;
  }
  return role;
};

export const statusApplyDownloads: {
  key: StatusApplyDownload;
  value: string;
}[] = [
  {
    key: StatusApplyDownload.Apply,
    value: "申請中",
  },
  {
    key: StatusApplyDownload.Approval,
    value: "承認済み",
  },
  {
    key: StatusApplyDownload.BoxDeliver,
    value: "送付済み",
  },
  {
    key: StatusApplyDownload.DlNotice,
    value: "DL済み",
  },
  {
    key: StatusApplyDownload.Removal,
    value: "消去",
  },
];

export const formatStatusApplyDownload = (status: string) => {
  const obj = statusApplyDownloads.filter(
    (statusApplyDownload) => status === statusApplyDownload.key
  );
  if (obj && obj[0] && obj[0].key) {
    return `${obj[0].value}`;
  }
  return status;
};
