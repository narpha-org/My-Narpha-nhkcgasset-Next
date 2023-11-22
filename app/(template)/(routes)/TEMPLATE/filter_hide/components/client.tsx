"use client";

import { useState, useEffect } from 'react'
import Image from 'next/image'
import classNames from 'classnames';

import { Loader } from '@/components/ui/loader';
import { NavHeaderMypage } from '@/components/nav-header-mypage';
import SearchBoxCGAssets from '../../components/search-box-cgassets';
import NavSideboxCgAssets from '../../components/nav-sidebox-cgassets';

interface TemplateTop2ClientProps { }

export const TemplateTop2Client: React.FC<TemplateTop2ClientProps> = ({ }) => {
  const [isClient, setIsClient] = useState(false)
  const [isNavSideboxClosed, setIsNavSideboxClosed] = useState(true)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Loader />
  }

  return (
    <>
      <NavHeaderMypage
        isNavSideboxClosed={isNavSideboxClosed}
      />

      {/* <!-- main --> */}
      <main className="maincon">
        <div className="search">
          <h2 className="search__title">ジャンルやキーワードを設定して、アセットを見つけよう。</h2>
          <SearchBoxCGAssets />
        </div>
        <div className="contents">
          <NavSideboxCgAssets
            setIsNavSideboxClosed={setIsNavSideboxClosed}
          />
          <div className="mainbox">
            <div className={classNames({
              "mainbox__inner":
                true,
              "inner-hidelist": isNavSideboxClosed === true,
            })}>
              <ul className={classNames({
                "mainbox__list":
                  true,
                "hidelist": isNavSideboxClosed === true,
              })}>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_001.jpg" width="360" height="203"
                      decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      静止画
                    </span>
                    <Image src="/assets/images/thumb_preview_002.jpg" width="360" height="203"
                      decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      動画
                    </span>
                    <Image src="/assets/images/thumb_preview_003.jpg" width="360" height="203"
                      decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_004.jpg" width="360" height="203"
                      decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_001.jpg" width="360" height="203"
                      decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      静止画
                    </span>
                    <Image src="/assets/images/thumb_preview_002.jpg" width="360" height="203"
                      decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      動画
                    </span>
                    <Image src="/assets/images/thumb_preview_003.jpg" width="360" height="203"
                      decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_004.jpg" width="360" height="203"
                      decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_001.jpg" width="360" height="203"
                      decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      静止画
                    </span>
                    <Image src="/assets/images/thumb_preview_002.jpg" width="360" height="203"
                      decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      動画
                    </span>
                    <Image src="/assets/images/thumb_preview_003.jpg" width="360" height="203"
                      decoding="async" alt="" />
                    <p>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</p>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="mainbox__category">
                      3DCG
                    </span>
                    <Image src="/assets/images/thumb_preview_004.jpg" width="360" height="203"
                      decoding="async" alt="" />
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
