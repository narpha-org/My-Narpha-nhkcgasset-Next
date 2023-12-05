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
        <div className="mypage">
          <div className="mypage__inner">
            <div className="mypage__mainbox">
              <div className="mypage__maincon">
                <div className="mypage__maincon-left">
                  <div className="mypage__maincon-news">
                    <h2 className="mypage__title">お知らせ<button className="select hide">新規作成</button></h2>
                    <div className="mypage__news">
                      <div className="mypage__news-box">
                        <p>
                          <span>2023年11月11日</span>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        </p>
                        <div className="toggle_button_box hide">
                          <button id="tag_gray-btn01" type="submit"
                            className="tag_gray">編集</button>
                          <button id="tag_gray-btn01" type="submit"
                            className="tag_gray">削除</button>
                        </div>
                      </div>
                      <div className="mypage__news-box">
                        <p><span>2023年11月11日</span>テキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                        <div className="toggle_button_box hide">
                          <button id="tag_gray-btn01" type="submit"
                            className="tag_gray">編集</button>
                          <button id="tag_gray-btn01" type="submit"
                            className="tag_gray">削除</button>
                        </div>
                      </div>
                      <div className="mypage__news-box">
                        <p>
                          <span>2023年11月11日</span>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        </p>
                        <div className="toggle_button_box hide">
                          <button id="tag_gray-btn01" type="submit"
                            className="tag_gray">編集</button>
                          <button id="tag_gray-btn01" type="submit"
                            className="tag_gray">削除</button>
                        </div>
                      </div>
                      <div className="mypage__news-box">
                        <p>
                          <span>2023年11月11日</span>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        </p>
                        <div className="toggle_button_box hide">
                          <button id="tag_gray-btn01" type="submit"
                            className="tag_gray">編集</button>
                          <button id="tag_gray-btn01" type="submit"
                            className="tag_gray">削除</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mypage__userinfo">
                    <h2 className="mypage__title">ユーザー情報</h2>
                    <ul>
                      <li>
                        <h3>Oktaユーザ名</h3>
                        <p>#000000</p>
                      </li>
                      <li>
                        <h3>メールアドレス</h3>
                        <p>abcdefg@hijklmn.co.jp</p>
                      </li>
                      <li>
                        <h3>主所属名</h3>
                        <p>テキストテキストテキストテキストテキストテキストテキスト</p>
                      </li>
                      <li>
                        <h3>主所属コード</h3>
                        <p>テキストテキストテキストテキストテキストテキストテキスト</p>
                      </li>
                      <li>
                        <h3>CGアセットストアロール</h3>
                        <p>テキストテキストテキストテキストテキストテキストテキスト</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mypage__maincon-right">
                  <h2 className="mypage__title">アセット情報<button className="registration">アセット新規登録<Image
                    src="/assets/images/plus.svg" width="9" height="9" decoding="async" alt="" /></button></h2>
                  <ul className="mypage__appry">
                    <li className="on">ダウンロード申請</li>
                    <li>アセット登録</li>
                  </ul>

                  <table className="mypage__mainlist">
                    <tbody>
                      <tr className="top">
                        <th>Date</th>
                        <th>Asset ID</th>
                        <th className="asset_name">Asset Name</th>
                        <th className="asset_min">申請者ID</th>
                        <th>番組許可者ID</th>
                        <th>Status</th>
                      </tr>
                      <tr>
                        <td>2023年11月11日</td>
                        <td>#00000000</td>
                        <td>タイトルタイトルタイトルタイトルタイトルタイトル</td>
                        <td>0000000000</td>
                        <td>000000000</td>
                        <td><button id="tag_gray-btn01" type="submit"
                          className="tag_gray on">申請承認</button></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><button id="tag_gray-btn01" type="submit"
                          className="tag_gray">承認済み</button></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><button id="tag_gray-btn01" type="submit"
                          className="tag_gray on">ダウンロード</button></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><button id="tag_gray-btn01" type="submit"
                          className="tag_gray">ダウンロード済み</button></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><button id="tag_gray-btn01" type="submit"
                          className="tag_gray">データ消去完了</button></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mypage__pagenation">
                    <ul>
                      <li>1</li>
                      <li>2</li>
                      <li>3</li>
                      <li>4</li>
                      <li>5</li>
                      <li>・</li>
                      <li>・</li>
                      <li>・</li>
                      <li>・</li>
                      <li>・</li>
                      <li>・</li>
                      <li>・</li>
                      <li>20</li>
                    </ul>

                    <div className="prev"><a href=""><Image src="/assets/images/prev02.svg" width="19" height="22"
                      decoding="async" alt="前のページへ" /></a><a href="">
                        <Image src="/assets/images/prev01.svg" width="19" height="22" decoding="async" alt="最初のページへ" /></a>
                    </div>
                    <div className="next"><a href="">
                      <Image src="/assets/images/next01.svg" width="19" height="22" decoding="async" alt="次のページへ" /></a>
                      <a href="">
                        <Image src="/assets/images/next02.svg" width="19" height="22" decoding="async" alt="最後のページへ" /></a>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
