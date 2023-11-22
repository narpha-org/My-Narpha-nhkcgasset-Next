"use client";

import { useState } from "react"
// import { useSession } from "next-auth/react";
import { Layout } from "lucide-react";
// import { IsRoleAdmin, IsRoleManager, IsRoleUser } from "@/lib/check-role-client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import CGAssetDetailClientPreview from "../client-detail-preview";
import { CgAsset, CgAssetCate, CgAssetTag, CgAssetUploadDir, CgaBroadcastingRight, CgaRegistrantAffiliation, CgaSharedArea, CgaViewingRestriction } from "@/graphql/generated/graphql";


interface CGAssetPreviewDialogProps {
  form: any;
  assetCates: CgAssetCate[];
  registrantAffiliations: CgaRegistrantAffiliation[];
  viewingRestrictions: CgaViewingRestriction[];
  broadcastingRights: CgaBroadcastingRight[];
  sharedAreas: CgaSharedArea[];
  uploadDirs: CgAssetUploadDir[];
};

const CGAssetPreviewDialog: React.FC<CGAssetPreviewDialogProps> = ({
  form,
  assetCates,
  registrantAffiliations,
  viewingRestrictions,
  broadcastingRights,
  sharedAreas,
  uploadDirs
}) => {
  const [open, setOpen] = useState(false);

  if (!form.getValues('assetCate') && form.getValues('assetCateId')) {
    const assetCateNew = assetCates.find(assetCate => assetCate.id === form.getValues('assetCateId')) as CgAssetCate;
    form.setValue('assetCate', assetCateNew);
  }

  // console.log(`form.getValues('assetTags'): ${JSON.stringify(form.getValues('assetTags'))}`);

  if (form.getValues('assetTagsStr')) {
    const assetTagsNew = form.getValues('assetTagsStr').split(',')
      .filter(tag => tag.length > 0)
      .map(tag => {
        return {
          id: tag,
          tag: tag,
          tag_add_edit_flg: 1
        }
      }) as unknown as CgAssetTag[];

    if (form.getValues('assetTags')) {
      const assetTagsOld = form.getValues('assetTags').filter(assetTag => assetTagsNew.some(el => el.tag === assetTag.tag) === true);
      const assetTagsNewOrig = assetTagsNew.filter(assetTag => assetTagsOld.some(el => el.tag === assetTag.tag) === false);
      form.setValue('assetTags', assetTagsOld.concat(assetTagsNewOrig));
    } else {
      form.setValue('assetTags', assetTagsNew);
    }

  }

  if (!form.getValues('broadcastingRight') && form.getValues('broadcastingRightId')) {
    const broadcastingRightNew = broadcastingRights.find(broadcastingRight => broadcastingRight.id === form.getValues('broadcastingRightId')) as CgaBroadcastingRight;
    form.setValue('broadcastingRight', broadcastingRightNew);
  }

  if (!form.getValues('registrantAffiliation') && form.getValues('registrantAffiliationId')) {
    const registrantAffiliationNew = registrantAffiliations.find(registrantAffiliation => registrantAffiliation.id === form.getValues('registrantAffiliationId')) as CgaRegistrantAffiliation;
    form.setValue('registrantAffiliation', registrantAffiliationNew);
  }

  if (!form.getValues('sharedArea') && form.getValues('sharedAreaId')) {
    const sharedAreaNew = sharedAreas.find(sharedArea => sharedArea.id === form.getValues('sharedAreaId')) as CgaSharedArea;
    form.setValue('sharedArea', sharedAreaNew);
  }

  if (!form.getValues('uploadDir') && form.getValues('uploadDirId')) {
    const uploadDirNew = uploadDirs.find(uploadDir => uploadDir.id === form.getValues('uploadDirId')) as CgAssetUploadDir;
    form.setValue('uploadDir', uploadDirNew);
  }

  if (!form.getValues('viewingRestriction') && form.getValues('viewingRestrictionId')) {
    const viewingRestrictionNew = viewingRestrictions.find(viewingRestriction => viewingRestriction.id === form.getValues('viewingRestrictionId')) as CgaViewingRestriction;
    form.setValue('viewingRestriction', viewingRestrictionNew);
  }

  // const cgAsset = form.getValues as unknown as CgAsset;
  const cgAsset = {
    /** アセット3DCG */
    asset3DCGs: form.getValues('asset3DCGs'),
    /** アセットアップロード */
    assetUploads: form.getValues('assetUploads'),
    /** アセットサムネイル */
    assetThumbs: form.getValues('assetThumbs'),
    /** アセット種別 */
    assetCate: form.getValues('assetCate'),
    /** アセット画像 */
    assetImages: form.getValues('assetImages'),
    /** アセットタグ */
    assetTags: form.getValues('assetTags'),
    /** アセット動画 */
    assetVideos: form.getValues('assetVideos'),
    /** 制作アプリ */
    asset_app_prod: form.getValues('asset_app_prod'),
    /** アセット詳細説明 */
    asset_detail: form.getValues('asset_detail'),
    /** 形式 */
    asset_format: form.getValues('asset_format'),
    /** ジャンル */
    asset_genre: form.getValues('asset_genre'),
    /** アセットID */
    asset_id: form.getValues('asset_id'),
    /** アップロード場所 */
    asset_media_base: form.getValues('asset_media_base'),
    /** アセット名 */
    asset_name: form.getValues('asset_name'),
    /** レンダラ */
    asset_renderer: form.getValues('asset_renderer'),
    /** ファイルサイズ */
    asset_size: form.getValues('asset_size'),
    /** 放送権利 */
    broadcastingRight: form.getValues('broadcastingRight'),
    /** When the CGAsset was created. */
    created_at: form.getValues('created_at') || "(自動登録)",
    /** DLカウント */
    download_count: form.getValues('download_count'),
    /** Unique primary key. */
    id: form.getValues('id') || "(自動登録)",
    /** 番組ID */
    program_id: form.getValues('program_id'),
    /** 番組名 */
    program_name: form.getValues('program_name'),
    /** 登録者所属 */
    registrantAffiliation: form.getValues('registrantAffiliation'),
    /** コメント・レビュー */
    reviews: form.getValues('reviews'),
    /** 修正履歴 */
    revisionHistories: form.getValues('revisionHistories'),
    /** 権利補足（使用上の注意） */
    rights_supplement: form.getValues('rights_supplement'),
    /** 公開エリア */
    sharedArea: form.getValues('sharedArea'),
    /** When the CGAsset was last updated. */
    updated_at: form.getValues('updated_at') || "(自動登録)",
    /** アップロード場所 */
    uploadDir: form.getValues('uploadDir'),
    /** 登録ユーザ */
    userCreate: form.getValues('userCreate') || { name: "(自動登録)" },
    /** 更新ユーザ */
    userUpdate: form.getValues('userUpdate') || { name: "(自動登録)" },
    /** 有効フラグ */
    valid_flg: form.getValues('valid_flg') || true,
    /** 閲覧制限 */
    viewingRestriction: form.getValues('viewingRestriction'),
  } as unknown as CgAsset;

  const child = <CGAssetDetailClientPreview
    cgAsset={cgAsset}
    cgaViewingRestrictions={viewingRestrictions}
    setDialogOpen={setOpen}
  />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Layout className="mr-2 h-4 w-4" /> プレビュー
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl" style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "95vw",
        maxWidth: "95vw",
        maxHeight: "90vh",
        overflowX: "auto",
        overflowY: "auto",
      }}>
        {child}
      </DialogContent>
    </Dialog >
  )
}

export default CGAssetPreviewDialog