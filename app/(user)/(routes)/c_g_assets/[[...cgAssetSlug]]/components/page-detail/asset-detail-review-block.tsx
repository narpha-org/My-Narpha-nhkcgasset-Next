import {
  CgAsset,
} from "@/graphql/generated/graphql";

interface AssetDetailReviewBlockProps {
  cgAsset: CgAsset;
}

const AssetDetailReviewBlock: React.FC<AssetDetailReviewBlockProps> = ({
  cgAsset
}) => {
  return (
    <>
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        アセット詳細説明
      </div>
      <div className="flex-grow h-full overflow-y-auto">
        <slot>
          コメント・レビュー
        </slot>
      </div>
    </>
  )
}

export default AssetDetailReviewBlock