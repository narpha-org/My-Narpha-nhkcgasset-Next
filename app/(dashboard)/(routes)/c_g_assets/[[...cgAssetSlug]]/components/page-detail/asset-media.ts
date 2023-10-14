import {
  CgAsset,
  CgAsset3Dcg,
  CgAssetImage,
  CgAssetVideo,
  CodeCgAssetCate,
} from "@/graphql/generated/graphql";

export const getAssetMedias = (elem: CgAsset) => {
  let ret: {
    mediaDesc: string;
    medias: CgAssetImage[] | CgAssetVideo[] | CgAsset3Dcg[] | null;
    notFound: string;
  } = {
    mediaDesc: "",
    medias: null,
    notFound: "",
  };

  switch (elem.assetCate?.code) {
    case CodeCgAssetCate.C3D:
      ret.mediaDesc = "3D";
      ret.medias = elem.asset3DCGs as CgAsset3Dcg[];
      ret.notFound = "/images/asset_3dcg.png";
      break;
    case CodeCgAssetCate.C2D:
      ret.mediaDesc = "2D";
      ret.medias = elem.assetVideos as CgAssetVideo[];
      ret.notFound = "/images/asset_video.png";
      break;
    case CodeCgAssetCate.Img:
      ret.mediaDesc = "";
      ret.medias = elem.assetImages as CgAssetImage[];
      ret.notFound = "/images/asset_image_notfound.png";
      break;
    default:
      ret.mediaDesc = "";
      ret.medias = null;
      ret.notFound = "";
  }

  return ret;
};
