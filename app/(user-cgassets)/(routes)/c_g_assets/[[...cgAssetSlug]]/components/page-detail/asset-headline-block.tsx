import {
  CgAsset,
} from "@/graphql/generated/graphql";
import { getAssetMedias } from "./asset-media";

interface AssetHeadlineBlockProps {
  cgAsset: CgAsset;
}

const AssetHeadlineBlock: React.FC<AssetHeadlineBlockProps> = ({
  cgAsset
}) => {
  const { mediaDesc, medias, notFound } = getAssetMedias(cgAsset);

  return (
    <>
      <div className="detail__title">
        <h2>{cgAsset.asset_name}</h2>
        <p>{mediaDesc}</p>
      </div>
    </>
  )
}

export default AssetHeadlineBlock