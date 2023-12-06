"use client";

import { Fragment, useRef, useState, useEffect } from 'react';
import Image from 'next/image'
import { Plus } from "lucide-react";
import classNames from 'classnames';

import {
  CgAsset,
  CgAssetReview
} from "@/graphql/generated/graphql";
import styles from "@/styles/components/cgasset-detail.module.css";
import AssetDetailReviewDialog from './asset-detail-review-dialog';

interface AssetDetailReviewBlockProps {
  cgAsset: CgAsset;
}

const AssetDetailReviewBlock: React.FC<AssetDetailReviewBlockProps> = ({
  cgAsset
}) => {
  const [isClosed, setIsClosed] = useState(false)
  const [childHeight, setChildHeight] = useState('')
  const refChild = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (refChild.current) {
      setChildHeight(refChild.current.style.height);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickFilter = (event) => {
    setIsClosed((_isClosed) => !_isClosed)

    if (isClosed) {
      if (refChild.current) {
        refChild.current.style.visibility = 'visible';
        refChild.current.style.height = 'auto';
        refChild.current.style.marginTop = '0.78125vw';
        refChild.current.style.padding = '1.0416666667vw 1.3020833333vw 0.78125vw';
      }
    } else {
      setTimeout(() => {
        if (refChild.current) {
          refChild.current.style.visibility = 'hidden';
          refChild.current.style.height = '0';
          refChild.current.style.marginTop = '0';
          refChild.current.style.padding = '0';
        }
      }, 200);
    }
  }

  return (
    <>
      <div className="detail__textbox">
        <h2>コメント</h2>
        <div ref={refChild} className={`${styles.childItem}`} style={{
          top: isClosed ? `-10vh` : '0',
          opacity: isClosed ? 0 : 1,
        }}>
          {cgAsset.reviews?.map((elem: CgAssetReview | null) => {

            if (elem && elem.valid_flg === true) {
              return <p key={elem.id}>{elem.review.split("\n").map((item, index) => {
                return (
                  <Fragment key={index}>{item}<br /></Fragment>
                );
              })}</p>
            }

          })}
        </div>
        <div className="flex justify-center" style={{
          width: '15rem',
          margin: '0 auto'
        }}>
          <button className="detail__closebtn"
            onClick={handleClickFilter}
            style={{ cursor: 'pointer' }}
          >{isClosed ?
            <>Open <Plus className="h-4 w-4" /></> :
            <>Close <Image src="/assets/images/close.svg" width="8"
              height="8" decoding="async" alt="close" /></>
            }</button>
          <AssetDetailReviewDialog cgAsset={cgAsset} isClosed={isClosed} />
        </div>
      </div >
    </>
  )
}

export default AssetDetailReviewBlock