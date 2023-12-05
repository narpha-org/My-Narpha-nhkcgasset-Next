"use client";

import { useState, useEffect } from 'react'
import Image from 'next/image'
// import classNames from 'classnames';

import { Loader } from '@/components/ui/loader';
import { NavHeaderMypage } from '@/components/nav-header-mypage';
// import SearchBoxCGAssets from './search-box-cgassets';
// import NavSideboxCgAssets from './nav-sidebox-cgassets';

interface TemplateClientProps { }

export const TemplateClient: React.FC<TemplateClientProps> = ({ }) => {
  // const [isClient, setIsClient] = useState(false)
  const [isNavSideboxClosed, setIsNavSideboxClosed] = useState(false)

  // useEffect(() => {
  //   setIsClient(true)
  // }, [])

  // if (!isClient) {
  //   return <Loader />
  // }

  return (
    <>
      <NavHeaderMypage
        isNavSideboxClosed={isNavSideboxClosed}
      />

      {/* <!-- main --> */}
      <main className="maincon">
        <div className="search">
          <h2 className="search__title">ジャンルやキーワードを設定して、アセットを見つけよう。</h2>
          <div className="search__box">
            <div className="search__pulldownbox">
              <select name="search__pulldown" className="search__pulldown">
                <option value="cg" className="first">3DCGモデル</option>
                <option value="sam01">静止画</option>
                <option value="sam02">動画</option>
              </select>
            </div>
            <div className="search__formbox">
              <form id="search-form" action="/" method="get">
                <input id="search-input" name="search-input" type="text" />
                <button id="btn" type="submit"><Image src="/assets/images/search_icon.svg"
                  width="22" height="22" decoding="async" alt="検索" /></button>
              </form>
            </div>
          </div>
        </div>
        <div className="contents">
          <div className="sidebox">
            <div className="sidebox__iconbox">
              <Image src="/assets/images/filter_icon.svg" width="30" height="28" decoding="async" alt="フィルターアイコン" />
            </div>
            <div className="sidebox__openbox">
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
          <div className="mainbox">
            <div className="mainbox__inner">
              <ul className="mainbox__list">
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_001.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      静止画
                    </span>
                    <Image src="/assets/images/thumb_preview_002.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      動画
                    </span>
                    <Image src="/assets/images/thumb_preview_003.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_004.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_001.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      静止画
                    </span>
                    <Image src="/assets/images/thumb_preview_002.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      動画
                    </span>
                    <Image src="/assets/images/thumb_preview_003.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_004.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_001.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      静止画
                    </span>
                    <Image src="/assets/images/thumb_preview_002.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      動画
                    </span>
                    <Image src="/assets/images/thumb_preview_003.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_004.jpg" width="360" height="203" decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
