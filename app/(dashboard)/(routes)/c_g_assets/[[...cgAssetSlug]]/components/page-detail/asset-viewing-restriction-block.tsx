import {
  CgAsset,
} from "@/graphql/generated/graphql";

interface AssetViewingRestrictionBlockProps {
  cgAsset: CgAsset;
}

const AssetViewingRestrictionBlock: React.FC<AssetViewingRestrictionBlockProps> = ({
  cgAsset
}) => {

  return (
    <>
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        <i className="title_icon" />
        閲覧権限
      </div>
      <div className="flex-grow h-full overflow-y-auto">
        <slot>
          {cgAsset.viewingRestriction?.desc}
        </slot>
      </div>
    </>
  )
}

export default AssetViewingRestrictionBlock