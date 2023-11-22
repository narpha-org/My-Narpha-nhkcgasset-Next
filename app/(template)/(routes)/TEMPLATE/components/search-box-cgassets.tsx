"use client";

import Image from 'next/image'

const SearchBoxCGAssets = () => {
  return (
    <>
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
            <button id="btn" type="submit"><Image
              src="/assets/images/search_icon.svg" width="22" height="22" decoding="async"
              alt="検索" /></button>
          </form>
        </div>
      </div>
    </>
  )
}

export default SearchBoxCGAssets