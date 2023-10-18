import {
  CgAsset,
} from "@/graphql/generated/graphql";

interface AssetRightsSupplementBlockProps {
  cgAsset: CgAsset;
}

const AssetRightsSupplementBlock: React.FC<AssetRightsSupplementBlockProps> = ({
  cgAsset
}) => {

  return (
    <>
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        <i className="title_icon" />
        権利・使用条件
      </div>
      <div className="flex-grow h-full overflow-y-auto">
        <slot>
          {cgAsset.rights_supplement}
        </slot>
      </div>
    </>
  )
}

export default AssetRightsSupplementBlock