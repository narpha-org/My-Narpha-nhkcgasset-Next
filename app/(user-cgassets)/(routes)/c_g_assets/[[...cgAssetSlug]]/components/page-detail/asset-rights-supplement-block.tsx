import { Fragment } from "react";
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
      <h2>権利・使用条件</h2>
      <p>{cgAsset.rights_supplement?.split("\n").map((item, index) => {
        return (
          <Fragment key={index}>{item}<br /></Fragment>
        );
      })}</p>
    </>
  )
}

export default AssetRightsSupplementBlock