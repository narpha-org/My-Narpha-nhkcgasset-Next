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
      <div className="dialog">
        <div className="dialog__text">
          <div className="dialog__text-box">
            <div className="dialog__text-main">
              <p>ダウンロード用データを再構築中です<br />
                再構築には時間を要する可能性がございます</p>
              <p>データを、マイページのダウンロード申請リストの<br />
                「ダウンロード」ボタンから、ダウンロードしてください</p>
            </div>
            <a href="">
              <Image src="/assets/images/dialog-close.svg" width="15" height="15" decoding="async" alt="CLOSE"
                className="dialog__close" />
            </a>
          </div>
        </div>
      </div>
      <main className="maincon">
        <div className="detail">
          <div className="detail__inner">
            <div className="detail__mainbox">
              <div className="detail__title">
                <h2>タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル</h2>
                <p>3DCG</p>
              </div>
              <div className="detail__mainimg">
                <a href="">
                  <Image src="/assets/images/detail_mainimg.jpg" width={753.75} height={425.47} className="img" alt="" />
                </a>
                <div className="detail__listbox">
                  <ul>
                    <li><a href="" className="active"><Image src="/assets/images/detail_tumb.jpg" width={66.29} height={37.71}
                      decoding="async" alt="" />
                    </a></li>
                    <li><a href=""><Image src="/assets/images/detail_tumb.jpg" width={66.29} height={37.71} decoding="async" alt="" />
                    </a></li>
                    <li><a href=""><Image src="/assets/images/detail_tumb.jpg" width={66.29} height={37.71} decoding="async" alt="" />
                    </a></li>
                    <li><a href=""><Image src="/assets/images/detail_tumb.jpg" width={66.29} height={37.71} decoding="async" alt="" />
                    </a></li>
                    <li><a href=""><Image src="/assets/images/detail_tumb.jpg" width={66.29} height={37.71} decoding="async" alt="" />
                    </a></li>
                    <li><a href=""><Image src="/assets/images/detail_tumb.jpg" width={66.29} height={37.71} decoding="async" alt="" />
                    </a></li>
                    <li><a href=""><Image src="/assets/images/detail_tumb.jpg" width={66.29} height={37.71} decoding="async" alt="" />
                    </a></li>
                    <li><a href=""><Image src="/assets/images/detail_tumb.jpg" width={66.29} height={37.71} decoding="async" alt="" />
                    </a></li>
                    <li><a href=""><Image src="/assets/images/detail_tumb.jpg" width={66.29} height={37.71} decoding="async" alt="" />
                    </a></li>
                  </ul>
                  <a href="#" className="detail__prev">
                    <Image src="/assets/images/detail-arrow-l.svg" alt="前のスライダーへ" width="16" height="45" decoding="async" />
                  </a>
                  <a href="#" className="detail__next">
                    <Image src="/assets/images/detail-arrow-r.svg" alt="次のスライダーへ" width="16" height="45" decoding="async" />
                  </a>
                </div>
              </div>
              <div className="detail__textbox">
                <h2>アセット詳細</h2>
                <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                  テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                  テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                  テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                  テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                  テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                <button className="detail__closebtn">Close<Image src="/assets/images/close.svg" width="8" height="8"
                  decoding="async" alt="close" /></button>
              </div>
              <div className="detail__textbox">
                <h2>コメント</h2>
                <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                  テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                  テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                  テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                  テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                <button className="detail__closebtn">Close<Image src="/assets/images/close.svg" width="8" height="8"
                  decoding="async" alt="close" /></button>
              </div>
              <div className="detail__textbox tagbox">
                <h2>タグ</h2>
                <div className="input_box">
                  <form id="tag-form" action="/" method="get">
                    <input id="tag-input" name="tag-input" type="text" />
                    <button id="tag_input-btn" type="submit">追加</button>
                  </form>
                </div>
                <div className="tag_gray_box">
                  <button id="tag_gray-btn01" type="submit" className="tag_gray">タグ</button>
                  <button id="tag_gray-btn02" type="submit" className="tag_gray">テキストテキスト</button>
                  <button id="tag_gray-btn03" type="submit" className="tag_gray">テキスト</button>
                </div>
                <div className="tag_white_box">
                  <button id="tag_white-btn01" type="submit" className="tag_gray">タグ</button>
                  <button id="tag_white-btn02" type="submit" className="tag_gray">テキストテキスト</button>
                  <button id="tag_white-btn03" type="submit" className="tag_gray">テキスト</button>
                </div>
              </div>
            </div>
            <div className="detail__side">
              <div className="detail__sidebtn">
                <div className="detail__sidedl">
                  <p>ダウンロード</p><button id="dl-btn01" type="submit" className="btn">開始</button>
                </div>
                <div className="detail__sidedl">
                  <button id="dl-btn02" type="submit" className="btn">編集</button>
                </div>
              </div>
              <div className="detail__sidecon">
                <h2>アセット仕様</h2>
                <dl>
                  <dt>アセットID</dt>
                  <dd>#0000000</dd>
                  <dt>アセット種別</dt>
                  <dd>3DCG</dd>
                  <dt>ジャンル</dt>
                  <dd>都市、ビル</dd>
                  <dt>制作ソフトウェア</dt>
                  <dd>Maya</dd>
                  <dt>形式</dt>
                  <dd>MayaBinary</dd>
                  <dt>ファイルサイズ</dt>
                  <dd>235MB</dd>
                  <dt>レンダラ</dt>
                  <dd>Arnold</dd>
                  <dt>番組ID</dt>
                  <dd>2300-456</dd>
                  <dt>番組名</dt>
                  <dd>Nスペ「恐竜」</dd>
                  <dt>登録者所属</dt>
                  <dd>NHKアート</dd>
                  <dt>公開範囲</dt>
                  <dd>一般公開可</dd>
                </dl>
                <h2>閲覧権限</h2>
                <ul className="authority">
                  <li className="select">制限なし</li>
                  <li>グループのみ</li>
                  <li>登録者のみ</li>
                </ul>
                <h2>権利・使用条件</h2>
                <p>NHK制作の番組であれば自由に使用可能。<br />
                  外部プロダクションに渡す場合は、○○に連絡。<br />
                  NHK制作の番組であれば自由に使用可能。<br />
                  外部プロダクションに渡す場合は、○○に連絡。
                </p>
              </div>
              <div className="detail__sidelog">
                <h2>更新ログ</h2>
                <ul className="detail__sideloglist">
                  <li><span>2023.10.10</span>
                    <p>テキストテキストテキストテキスト</p>
                  </li>
                  <li><span>2023.10.09</span>
                    <p>テキストテキストテキスト</p>
                  </li>
                  <li><span>2023.10.8</span>
                    <p>テキストテキスト</p>
                  </li>
                  <li><span>2023.00.00</span>
                    <p>テキストテキストテキストテキスト</p>
                  </li>
                  <li><span>2023.00.00</span>
                    <p>テキストテキストテキスト</p>
                  </li>

                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
