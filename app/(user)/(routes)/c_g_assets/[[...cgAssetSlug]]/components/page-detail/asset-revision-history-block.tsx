
import { Fragment } from "react";
import {
  CgAsset, CgaRevisionHistory,
} from "@/graphql/generated/graphql";

interface AssetRevisionHistoryBlockProps {
  cgAsset: CgAsset;
}

const AssetRevisionHistoryBlock: React.FC<AssetRevisionHistoryBlockProps> = ({
  cgAsset
}) => {

  return (
    <>
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        <i className="title_icon" />
        修正履歴
      </div>
      <div className="flex-grow h-full overflow-y-auto">
        {cgAsset.revisionHistories?.map((elem: CgaRevisionHistory | null) => {

          if (elem) {
            return <div key={elem.id} className="flex flex-wrap justify-between mb-5">
              <div className="">{elem.created_at}</div>
              <div className="ml-2 w-full">{elem.desc.split("\n").map((item, index) => {
                return (
                  <Fragment key={index}>{item}<br /></Fragment>
                );
              })}</div>
              {/* <div>{elem.revisedUser?.name}</div> */}
            </div>
          }
        })}
      </div>
    </>
  )
}

export default AssetRevisionHistoryBlock