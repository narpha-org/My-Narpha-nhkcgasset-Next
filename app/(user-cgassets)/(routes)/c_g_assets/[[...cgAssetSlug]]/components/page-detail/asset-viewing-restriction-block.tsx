import classNames from "classnames";
import {
  CgAsset, CgaViewingRestriction,
} from "@/graphql/generated/graphql";

interface AssetViewingRestrictionBlockProps {
  cgAsset: CgAsset;
  cgaViewingRestrictions: CgaViewingRestriction[]
}

const AssetViewingRestrictionBlock: React.FC<AssetViewingRestrictionBlockProps> = ({
  cgAsset,
  cgaViewingRestrictions
}) => {

  return (
    <>
      <h2>閲覧権限</h2>
      <ul className="authority">
        {cgaViewingRestrictions.map((elem, idx) => {
          return <li
            key={elem.id}
            className={classNames({
              "select": elem.id === cgAsset.viewingRestriction?.id,
            })}
          >
            {elem.desc}
          </li>
        })}
      </ul>
    </>
  )
}

export default AssetViewingRestrictionBlock