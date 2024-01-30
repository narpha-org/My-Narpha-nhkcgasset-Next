import {
  CgAsset,
  CodeCgAssetCate,
  CgAssetThumb,
  // CgAsset3Dcg,
  // CgAssetImage,
  // CgAssetVideo,
} from "@/graphql/generated/graphql";

export const getAssetMedias = (elem: CgAsset) => {
  let ret: {
    mediaDesc: string;
    medias: CgAssetThumb[] | null;
    notFound: string;
  } = {
    mediaDesc: "",
    medias: null,
    notFound: "",
  };

  switch (elem.assetCate?.code) {
    case CodeCgAssetCate.C3D:
      ret.mediaDesc = "3DCG";
      ret.medias = elem.assetThumbs as CgAssetThumb[];
      ret.notFound = "/images/asset_3dcg.png";
      break;
    case CodeCgAssetCate.C2D:
      ret.mediaDesc = "動画";
      ret.medias = elem.assetThumbs as CgAssetThumb[];
      ret.notFound = "/images/asset_video.png";
      break;
    case CodeCgAssetCate.Img:
      ret.mediaDesc = "静止画";
      ret.medias = elem.assetThumbs as CgAssetThumb[];
      ret.notFound = "/images/asset_image_notfound.png";
      break;
    default:
      ret.mediaDesc = "";
      ret.medias = elem.assetThumbs as CgAssetThumb[];
      ret.notFound = "/images/asset_image_notfound.png";
  }

  return ret;
};
