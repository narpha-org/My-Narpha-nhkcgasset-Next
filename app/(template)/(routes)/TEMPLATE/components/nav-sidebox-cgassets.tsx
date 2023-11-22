"use client";

import { Dispatch, SetStateAction, useRef, useState } from 'react';
import Image from 'next/image';

import styles from "./nav-sidebox.module.css";

interface NavSideboxCgAssetsProps {
  setIsNavSideboxClosed: Dispatch<SetStateAction<boolean>>;
}

const NavSideboxCgAssets: React.FC<NavSideboxCgAssetsProps> = ({
  setIsNavSideboxClosed,
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
          <h2>フィルター</h2>
          <dl className="sidebox__type">
            <dt>アセット種別</dt>
            <dd>
              <label className="sidebox__check-input">
                <input className="sidebox__input" type="checkbox" />
                <span className="sidebox__input-text">3DCGモデル</span>
              </label>
            </dd>
            <dd>
              <label className="sidebox__check-input">
                <input className="sidebox__input" type="checkbox" />
                <span className="sidebox__input-text">静止画</span>
              </label>
            </dd>
            <dd>
              <label className="sidebox__check-input">
                <input className="sidebox__input" type="checkbox" />
                <span className="sidebox__input-text">動画</span>
              </label>
            </dd>
          </dl>
          <dl className="sidebox__genre">
            <dt>ジャンル</dt>
            <dd>
              <label className="sidebox__check-input">
                <input className="sidebox__input" type="checkbox" />
                <span className="sidebox__input-text">テキストテキストテキスト</span>
              </label>
            </dd>
            <dd>
              <label className="sidebox__check-input">
                <input className="sidebox__input" type="checkbox" />
                <span className="sidebox__input-text">テキストテキストテキスト</span>
              </label>
            </dd>
            <dd>
              <label className="sidebox__check-input">
                <input className="sidebox__input" type="checkbox" />
                <span className="sidebox__input-text">テキストテキストテキスト</span>
              </label>
            </dd>
          </dl>
          <dl className="sidebox__software">
            <dt>制作ソフトウェア</dt>
            <dd>
              <label className="sidebox__check-input">
                <input className="sidebox__input" type="checkbox" />
                <span className="sidebox__input-text">テキストテキストテキスト</span>
              </label>
            </dd>
            <dd>
              <label className="sidebox__check-input">
                <input className="sidebox__input" type="checkbox" />
                <span className="sidebox__input-text">テキストテキストテキスト</span>
              </label>
            </dd>
            <dd>
              <label className="sidebox__check-input">
                <input className="sidebox__input" type="checkbox" />
                <span className="sidebox__input-text">テキストテキストテキスト</span>
              </label>
            </dd>
          </dl>
        </div>
      </div>
    </>
  )
}

export default NavSideboxCgAssets