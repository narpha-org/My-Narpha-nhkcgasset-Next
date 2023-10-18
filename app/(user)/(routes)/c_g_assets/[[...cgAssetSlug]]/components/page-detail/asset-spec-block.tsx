import {
  CgAsset,
} from "@/graphql/generated/graphql";

interface AssetSpecBlockProps {
  cgAsset: CgAsset;
}

const AssetSpecBlock: React.FC<AssetSpecBlockProps> = ({
  cgAsset
}) => {

  return (
    <>
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        <i className="title_icon" />
        アセット仕様
      </div>
      <div className="flex-grow h-full overflow-y-auto">
        <div className="mt-6">
          アセットID: {cgAsset.asset_id}
        </div>
        <div className="mt-6">
          登録日: {cgAsset.created_at}
        </div>
        <div className="mt-6">
          種別: {cgAsset.assetCate?.desc}
        </div>
        <div className="mt-6">
          制作アプリ: {cgAsset.asset_app_prod}
        </div>
        <div className="mt-6">
          形式: {cgAsset.asset_format}
        </div>
        <div className="mt-6">
          サイズ: {cgAsset.asset_size}
        </div>
        <div className="mt-6">
          レンダラ: {cgAsset.asset_renderer}
        </div>
        <div className="mt-6">
          番組ID: {cgAsset.program_id}
        </div>
        <div className="mt-6">
          番組名: {cgAsset.program_name}
        </div>
        <div className="mt-6">
          登録者: {cgAsset.userCreate.name}
        </div>
        <div className="mt-6">
          公開: {cgAsset.sharedArea?.desc}
        </div>
      </div>
    </>
  )
}

export default AssetSpecBlock