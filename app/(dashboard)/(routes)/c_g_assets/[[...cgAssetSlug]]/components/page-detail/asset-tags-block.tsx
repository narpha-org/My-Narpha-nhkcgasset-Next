import {
  CgAsset,
} from "@/graphql/generated/graphql";

interface AssetTagsBlockProps {
  cgAsset: CgAsset;
}

const AssetTagsBlock: React.FC<AssetTagsBlockProps> = ({
  cgAsset
}) => {

  return (
    <>
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        タグ一覧
      </div>
      <div className="flex-grow h-full overflow-y-auto">
        <div className="mt-6">
          {cgAsset?.assetTags?.map(assetTag => assetTag?.tag).join(', ')}
        </div>
        <div className="mt-24">
          タグ入力枠
        </div>
      </div>
    </>
  )
}

export default AssetTagsBlock