export enum CGAssetPageSlug {
  New = "new",
  Edit = "edit",
  ApplyDownload = "apply-download",
}

export interface CGAssetPageProps {
  params: {
    cgAssetSlug: string[];
  };
}
