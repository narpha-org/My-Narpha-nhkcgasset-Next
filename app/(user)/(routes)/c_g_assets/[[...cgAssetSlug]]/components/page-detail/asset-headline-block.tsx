import {
  CgAsset,
} from "@/graphql/generated/graphql";

interface AssetHeadlineBlockProps {
  cgAsset: CgAsset;
}

const AssetHeadlineBlock: React.FC<AssetHeadlineBlockProps> = ({
  cgAsset
}) => {

  return (
    <>
      <div className="block text-lg font-semibold py-2 px-2">
        {cgAsset.uploadDir?.base_path}
      </div>
      <div className="block text-lg font-semibold py-2 px-2">
        {cgAsset.asset_name}
      </div>
    </>
  )
}

export default AssetHeadlineBlock