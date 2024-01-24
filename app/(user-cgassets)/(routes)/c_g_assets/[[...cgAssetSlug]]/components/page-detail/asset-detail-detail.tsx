"use client";

import { Fragment, useRef, useState, useEffect } from 'react';
import Image from 'next/image'
import { Plus } from "lucide-react";
import classNames from 'classnames';

import {
  CgAsset,
} from "@/graphql/generated/graphql";
import styles from "@/styles/components/cgasset-detail.module.css";

interface AssetDetailDetailBlockProps {
  cgAsset: CgAsset;
}

const AssetDetailDetailBlock: React.FC<AssetDetailDetailBlockProps> = ({
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
        <h2>アセット詳細</h2>
        <p ref={refChild} className={`p_txt ${styles.childItem}`} style={{
          top: isClosed ? `-10vh` : '0',
          opacity: isClosed ? 0 : 1,
        }}>{cgAsset.asset_detail.split("\n").map((item, index) => {
          return (
            <Fragment key={index}>{item}<br /></Fragment>
          );
        })}</p>
        <button className="detail__closebtn"
          onClick={handleClickFilter}
          style={{ cursor: 'pointer' }}
        >{isClosed ?
          <>Open <Plus className="h-4 w-4" /></> :
          <>Close <Image src="/assets/images/close.svg" width="8"
            height="8" decoding="async" alt="close" /></>
          }</button>
      </div>
    </>
  )
}

export default AssetDetailDetailBlock