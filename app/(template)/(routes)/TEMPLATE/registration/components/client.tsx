"use client";

import { useState, useEffect } from 'react'
import Image from 'next/image'

import { Loader } from '@/components/ui/loader';
import { NavHeaderMypage } from '@/components/nav-header-mypage';

interface TemplateRegistrationClientProps { }

export const TemplateRegistrationClient: React.FC<TemplateRegistrationClientProps> = ({ }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Loader />
  }

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
                <input id="assets-title" name="assets-title" type="text" />
              </div>
              <div className="registration__maincon">
                <div className="registration__maincon-left">
                  <h2>アセットタイトル</h2>
                  <dl>
                    <dt>アセットID</dt>
                    <dd>
                      <p className="asset-id">#000000</p>
                    </dd>
                    <dt>アセット種別</dt>
                    <dd>
                      <select name="assets__type" className="assets-pulldown">
                        <option hidden className="first"></option>
                        <option value="type01">3DCGモデル</option>
                        <option value="type02">静止画</option>
                        <option value="type03">動画</option>
                      </select>
                    </dd>
                    <dt>ジャンル</dt>
                    <dd><input id="assets-input01" name="assets__genre" type="text"
                      className="assets-input" /></dd>
                    <dt>制作ソフトウェア</dt>
                    <dd><input id="assets-input02" name="assets__soft" type="text"
                      className="assets-input" /></dd>
                    <dt>形式</dt>
                    <dd><input id="assets-input03" name="assets__format" type="text"
                      className="assets-input" /></dd>
                    <dt>ファイルサイズ</dt>
                    <dd><input id="assets-input04" name="assets__file" type="text"
                      className="assets-input" /></dd>
                    <dt>レンダラ</dt>
                    <dd><input id="assets-input05" name="assets__renderer" type="text"
                      className="assets-input" /></dd>
                    <dt>番組ID</dt>
                    <dd><input id="assets-input06" name="assets__program-id" type="text"
                      className="assets-input" /></dd>
                    <dt>番組名</dt>
                    <dd><input id="assets-input07" name="assets__program-name" type="text"
                      className="assets-input" /></dd>
                    <dt>登録者所属</dt>
                    <dd>
                      <select name="assets__affiliation" className="assets-pulldown">
                        <option hidden className="first"></option>
                        <option value="type01">サンプル1</option>
                        <option value="type02">サンプル2</option>
                        <option value="type03">サンプル3</option>
                      </select>
                    </dd>
                    <dt>公開</dt>
                    <dd>
                      <div className="radio_box">
                        <label><input type="radio" name="release" />一般公開可</label>
                        <label><input type="radio" name="release" />一般公開不可</label>
                      </div>
                    </dd>
                    <dt>観覧権限</dt>
                    <dd>
                      <div className="radio_box">
                        <label><input type="radio" name="privileges" />制限なし</label>
                        <label><input type="radio" name="privileges" />グループのみ</label>
                        <label><input type="radio" name="privileges" />登録者のみ</label>
                      </div>
                    </dd>
                    <dt>放送権利</dt>
                    <dd>
                      <select name="assets__affiliation" className="assets-pulldown">
                        <option hidden className="first"></option>
                        <option value="type01">サンプル1</option>
                        <option value="type02">サンプル2</option>
                        <option value="type03">サンプル3</option>
                      </select>
                    </dd>
                    <dt className="areamax">権利使用条件</dt>
                    <dd className="areamax">
                      <textarea id="conditions" name="conditions" rows={5} cols={33}
                        className="assets-textarea"></textarea>
                    </dd>
                    <dt className="areamax">アセット詳細説明</dt>
                    <dd className="areamax">
                      <textarea id="explanation" name="explanation" rows={5} cols={33}
                        className="assets-textarea"></textarea>
                    </dd>
                  </dl>
                </div>
                <div className="registration__maincon-right">
                  <div className="registration__maincon-upload">
                    <h2>アップロード<button className="select">ファイルから選択</button></h2>
                    <div className="deco-file">
                      <label>
                        <input type="file" name="uploads[]" multiple />
                        <a href=""><Image src="/assets/images/up_close.svg" width="15" height="15"
                          decoding="async" alt="close" className="up_close" /></a>
                      </label>
                      <label>
                        <input type="file" name="uploads[]" multiple /> <a href=""><Image
                          src="/assets/images/up_close.svg" width="15" height="15"
                          decoding="async" alt="close" className="up_close" /></a>
                      </label>
                      <label>
                        <input type="file" name="uploads[]" multiple /> <a href=""><Image
                          src="/assets/images/up_close.svg" width="15" height="15"
                          decoding="async" alt="close" className="up_close" /></a>
                      </label>
                      <label>
                        <input type="file" name="uploads[]" multiple /> <a href=""><Image
                          src="/assets/images/up_close.svg" width="15" height="15"
                          decoding="async" alt="close" className="up_close" /></a>
                      </label>
                    </div>
                  </div>
                  <div className="registration__maincon-tumb">
                    <h2>サムネイル<button className="select">ファイルから選択</button></h2>
                    <ul>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                      <li><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
                        <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
                      </li>
                    </ul>
                  </div>
                  <div className="registration__maincon-tag">
                    <h2>タグ</h2>
                    <div className="tag_list">
                      <button id="tag_gray-btn01" type="submit"
                        className="tag_gray">タグ</button>
                      <button id="tag_gray-btn02" type="submit"
                        className="tag_gray">テキストテキスト</button>
                      <button id="tag_gray-btn03" type="submit"
                        className="tag_gray">テキスト</button>
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
                  <div className="togglebox">
                    <p>公開</p>

                    <div className="toggle_button">
                      <input id="toggle" className="toggle_input" type='checkbox' />
                      <label htmlFor="toggle" className="toggle_label" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="registration__sidelog">
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
