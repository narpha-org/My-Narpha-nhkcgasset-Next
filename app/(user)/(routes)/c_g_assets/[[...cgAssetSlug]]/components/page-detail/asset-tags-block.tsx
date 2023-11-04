import { Button } from "@/components/ui/button";
import {
  CgAsset,
} from "@/graphql/generated/graphql";
import { AssetTagForm } from "./asset-tag-form";

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
        <div className="mt-8">
          <AssetTagForm cgAsset={cgAsset} />
        </div>
        <div className="mt-6">
          {cgAsset && cgAsset.assetTags && [...cgAsset.assetTags]
            .sort((a, b) => Number(b?.tag_add_edit_flg) - Number(a?.tag_add_edit_flg))
            .map(assetTag => {
              return (
                <Button
                  key={assetTag?.id}
                  variant={assetTag?.tag_add_edit_flg ? "ghost" : "outline"}
                >
                  {assetTag?.tag}
                </Button>
              )
            })}
        </div>
      </div>
    </>
  )
}

export default AssetTagsBlock