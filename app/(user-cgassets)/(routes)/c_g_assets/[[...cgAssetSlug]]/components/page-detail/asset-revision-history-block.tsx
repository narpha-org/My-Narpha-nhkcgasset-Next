
import { Fragment } from "react";
import { dateFormat } from "@/lib/utils"

import {
  CgAsset, CgaRevisionHistory,
} from "@/graphql/generated/graphql";

interface AssetRevisionHistoryBlockProps {
  cgAsset: CgAsset | null;
}

const AssetRevisionHistoryBlock: React.FC<AssetRevisionHistoryBlockProps> = ({
  cgAsset
}) => {

  return (
    <>
      <h2>更新ログ</h2>
      <ul className="detail__sideloglist">
        {cgAsset && cgAsset.revisionHistories?.map((elem: CgaRevisionHistory | null) => {

          if (elem) {
            return <li key={elem.id} className="">
              <span>{dateFormat(elem.created_at, 'yyyy.MM.dd')}</span>
              <p>{elem.desc.split("\n").map((item, index) => {
                return (
                  <Fragment key={index}>{item}<br /></Fragment>
                );
              })}</p>
              {/* <p>{elem.revisedUser?.name}</p> */}
            </li>
          }
        })}
      </ul>
    </>
  )
}

export default AssetRevisionHistoryBlock