"use client";

import { Dispatch, SetStateAction, useRef, useState } from 'react';
import Image from 'next/image';

import {
  CgAssetCate,
  CgAssetSearchAppProd,
  CgAssetSearchTag,
} from '@/graphql/generated/graphql';

import { useCgAssetsSearchForm, CgAssetsSearchFormValues } from '@/hooks/use-cgassets-search-form';

import { NavSideboxCgAssetsForm } from './nav-sidebox-cgassets-form';
import styles from "@/styles/components/nav-sidebox.module.css";

interface NavSideboxCgAssetsProps {
  searchData: CgAssetsSearchFormValues;
  assetCates: CgAssetCate[];
  assetSearchTags: CgAssetSearchTag[];
  assetSearchAppProds: CgAssetSearchAppProd[];
  onSearchFromSubmit: (data: CgAssetsSearchFormValues) => void;
  setIsNavSideboxClosed: Dispatch<SetStateAction<boolean>>;
  isNavHeaderSubmitting: boolean;
  parentLoading: boolean;
}

export const NavSideboxCgAssets: React.FC<NavSideboxCgAssetsProps> = ({
  searchData,
  assetCates,
  assetSearchTags,
  assetSearchAppProds,
  onSearchFromSubmit,
  setIsNavSideboxClosed,
  isNavHeaderSubmitting,
  parentLoading,
}) => {
  const [isClosed, setIsClosed] = useState(false)
  const refSidebox = useRef<HTMLDivElement>(null)

  const handleClickFilter = (event) => {
    setIsClosed((_isClosed) => !_isClosed)
    setIsNavSideboxClosed((_isNavSideboxClosed) => !_isNavSideboxClosed)

    if (isClosed) {
      if (refSidebox.current) {
        refSidebox.current.style.visibility = 'visible';
        refSidebox.current.style.width = '12.5vw';
      }
    } else {
      setTimeout(() => {
        if (refSidebox.current) {
          refSidebox.current.style.visibility = 'hidden';
          refSidebox.current.style.width = '0vw';
        }
      }, 200);
    }
  }

  return (
    <>
      <div className="sidebox">
        <div className={`sidebox__iconbox ${styles.parentItem}`}
          onClick={handleClickFilter}
          style={{ cursor: 'pointer' }}
        >
          <Image src="/assets/images/filter_icon.svg" width="30" height="28" decoding="async"
            alt="フィルターアイコン" />
        </div>
        <div ref={refSidebox} className={`sidebox__openbox ${styles.childItem}`} style={{
          left: isClosed ? `-12.5vw` : '0vw',
          opacity: isClosed ? 0 : 1,
        }}>
          <NavSideboxCgAssetsForm
            searchData={searchData}
            assetCates={assetCates}
            assetSearchTags={assetSearchTags}
            assetSearchAppProds={assetSearchAppProds}
            onSearchFromSubmit={onSearchFromSubmit}
            isNavHeaderSubmitting={isNavHeaderSubmitting}
            parentLoading={parentLoading}
          />
        </div>
      </div>
    </>
  )
}
