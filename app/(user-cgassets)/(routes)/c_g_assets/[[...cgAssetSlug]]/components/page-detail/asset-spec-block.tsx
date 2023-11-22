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
      <h2>アセット仕様</h2>
      <dl>
        <dt>アセットID</dt>
        <dd>{cgAsset.asset_id}</dd>
        <dt>アセット種別</dt>
        <dd>{cgAsset.assetCate?.desc}</dd>
        <dt>ジャンル</dt>
        <dd>{cgAsset.asset_genre}</dd>
        <dt>制作ソフトウェア</dt>
        <dd>{cgAsset.asset_app_prod}</dd>
        <dt>形式</dt>
        <dd>{cgAsset.asset_format}</dd>
        <dt>ファイルサイズ</dt>
        <dd>{cgAsset.asset_size}</dd>
        <dt>レンダラ</dt>
        <dd>{cgAsset.asset_renderer}</dd>
        <dt>番組ID</dt>
        <dd>{cgAsset.program_id}</dd>
        <dt>番組名</dt>
        <dd>{cgAsset.program_name}</dd>
        <dt>登録者所属</dt>
        <dd>{cgAsset.userCreate.registrantAffiliation?.desc}</dd>
        <dt>公開範囲</dt>
        <dd>{cgAsset.sharedArea?.desc}</dd>
      </dl>
    </>
  )
}

export default AssetSpecBlock