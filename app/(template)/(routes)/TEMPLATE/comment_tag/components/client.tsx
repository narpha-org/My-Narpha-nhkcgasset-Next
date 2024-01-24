"use client";

import { useState, useEffect } from 'react'
import Image from 'next/image'

import { Loader } from '@/components/ui/loader';
import { NavHeaderMypage } from '@/components/nav-header-mypage';

interface TemplateClientProps { }

export const TemplateClient: React.FC<TemplateClientProps> = ({ }) => {
  // const [isClient, setIsClient] = useState(false)

  // useEffect(() => {
  //   setIsClient(true)
  // }, [])

  // if (!isClient) {
  //   return <Loader />
  // }

  return (
    <>
      <NavHeaderMypage />

      {/* <!-- main --> */}
      <main className="maincon">
        <div className="registration">
          <div className="registration__inner">
            <div className="registration__mainbox">
              <div className="registration__title">
                <h2>アセットタイトル</h2>
              </div>
              <div className="registration__maincon">
                <div className="registration__maincon-left">
                  <h2 className="comment_title">コメント</h2>
                  <div className="comment_block">
                    <div className="comment-box">
                      <div className="toggle_button">
                        <input id="toggle" className="toggle_input" type='checkbox' />
                        <label htmlFor="toggle" className="toggle_label" />
                      </div>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                    </div>
                    <div className="comment-box">
                      <div className="toggle_button">
                        <input id="toggle" className="toggle_input" type='checkbox' />
                        <label htmlFor="toggle" className="toggle_label" />
                      </div>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>

                    </div>
                    <div className="comment-box">
                      <div className="toggle_button">
                        <input id="toggle" className="toggle_input" type='checkbox' />
                        <label htmlFor="toggle" className="toggle_label" />
                      </div>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                    </div>
                    <div className="comment-box">
                      <div className="toggle_button">
                        <input id="toggle" className="toggle_input" type='checkbox' />
                        <label htmlFor="toggle" className="toggle_label" />
                      </div>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>

                    </div>
                    <div className="comment-box">
                      <div className="toggle_button">
                        <input id="toggle" className="toggle_input" type='checkbox' />
                        <label htmlFor="toggle" className="toggle_label" />
                      </div>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>

                    </div>
                    <div className="comment-box">
                      <div className="toggle_button">
                        <input id="toggle" className="toggle_input" type='checkbox' />
                        <label htmlFor="toggle" className="toggle_label" />
                      </div>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>

                    </div>
                  </div>
                </div>
                <div className="registration__maincon-right">

                  <div className="registration__maincon-user-tag">
                    <h2>ユーザータグリスト</h2>
                    <div className="tag_list">
                      <button id="tag_gray-btn01" type="submit"
                        className="tag_gray">タグ</button>
                      <button id="tag_gray-btn02" type="submit"
                        className="tag_gray">テキストテキスト</button>
                      <button id="tag_gray-btn03" type="submit"
                        className="tag_gray on">テキスト</button>
                      <button id="tag_gray-btn01" type="submit"
                        className="tag_gray">タグ</button>
                      <button id="tag_gray-btn02" type="submit"
                        className="tag_gray on">テキストテキスト</button>
                      <button id="tag_gray-btn03" type="submit"
                        className="tag_gray">テキスト</button>
                      <button id="tag_gray-btn02" type="submit"
                        className="tag_gray">テキストテキスト</button>
                      <button id="tag_gray-btn03" type="submit"
                        className="tag_gray">テキスト</button>
                      <button id="tag_gray-btn02" type="submit"
                        className="tag_gray">テキストテキスト</button>
                      <button id="tag_gray-btn03" type="submit"
                        className="tag_gray">テキスト</button>
                      <button id="tag_gray-btn01" type="submit"
                        className="tag_gray">タグ</button>
                      <button id="tag_gray-btn02" type="submit"
                        className="tag_gray">テキストテキスト</button>
                      <button id="tag_gray-btn03" type="submit"
                        className="tag_gray on">テキスト</button>
                      <button id="tag_gray-btn03" type="submit"
                        className="tag_gray on">テキスト</button>
                      <input id="tag_form" className="input-text js-input" type="text" required />
                    </div>
                  </div>

                </div>

              </div>
            </div>
            <div className="registration__side">
              <div className="registration__sidestatus">
                <div className="registration__sidestatus-con">
                  <h2>公開ステータス</h2>
                  <div className="keepbox">
                    <button id="dl-btn02" type="submit"
                      className="btn">保存</button>
                    <p>2023.11.11</p>
                  </div>
                </div>
              </div>

            </div>
            <a href="" className="registration__regist_back_btn">
              <Image src="../assets/images/regist_back_btn_arrow.svg" alt="矢印" width="13" height="22"
                decoding="async" className="arrow" />
            </a>
          </div>
        </div>
      </main>
    </>
  );
};
