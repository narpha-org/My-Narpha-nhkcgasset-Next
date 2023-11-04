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
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        <i className="title_icon" />
        閲覧権限
      </div>
      <div className="flex-grow h-full overflow-y-auto">
        <slot>
          {cgaViewingRestrictions.map((elem, idx) => {
            return <>
              {idx > 0 && (
                <span className="">／</span>
              )}
              <span
                key={elem.id}
                className={classNames({
                  "font-bold": elem.id === cgAsset.viewingRestriction?.id,
                  "font-light": elem.id !== cgAsset.viewingRestriction?.id,
                })}
              >
                {elem.desc}
              </span>
            </>
          })}
        </slot>
      </div>
    </>
  )
}

export default AssetViewingRestrictionBlock