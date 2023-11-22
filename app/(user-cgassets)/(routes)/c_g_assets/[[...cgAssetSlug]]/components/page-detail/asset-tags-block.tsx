import { Button } from "@/components/ui/button-raw";
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
      <div className="detail__textbox tagbox">
        <h2>タグ</h2>
        <AssetTagForm cgAsset={cgAsset} />
        <div className="tag_gray_box">
          {cgAsset && cgAsset.assetTags && [...cgAsset.assetTags]
            .filter((assetTag) => { return assetTag?.tag_add_edit_flg === true })
            .map(assetTag => {
              return (
                <Button
                  key={assetTag?.id}
                  className="tag_gray"
                >
                  {assetTag?.tag}
                </Button>
              )
            })}
        </div>
        <div className="tag_white_box">
          {cgAsset && cgAsset.assetTags && [...cgAsset.assetTags]
            .filter((assetTag) => { return assetTag?.tag_add_edit_flg === false })
            .map(assetTag => {
              return (
                <Button
                  key={assetTag?.id}
                  className="tag_gray"
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