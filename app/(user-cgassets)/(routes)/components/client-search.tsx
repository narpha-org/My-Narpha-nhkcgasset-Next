"use client";

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react";
// import { Plus } from "lucide-react";
// import { useRouter } from "next/navigation";
import _ from 'lodash';

import {
  CgAsset,
  CgAssetCate,
  CgAssetSearchAppProd,
  CgAssetSearchGenre,
  PaginatorInfo
} from '@/graphql/generated/graphql';
import {
  useCgAssetsSearchForm,
  CgAssetsSearchFormValues,
  INIT_CGASSET_SEARCH_FORM_VALUES
} from "@/hooks/use-cgassets-search-form";
import { NavHeaderMypage } from '@/components/nav-header-mypage';
import { ROW_COUNT_CGASSETS } from "@/lib/pagenation";

// import { Heading } from "@/components/ui/heading";
// import { Separator } from "@/components/ui/separator";
import { fetchData } from './page-search/fetch-data';
import { NavHeaderCgAssets } from './page-search/nav-header-cgassets';
import { NavSideboxCgAssets } from './page-search/nav-sidebox-cgassets';
// import { Button } from "@/components/ui/button";
import { SearchResult } from "./page-search/search-result";
// import { IsRoleUser } from "@/lib/check-role-client";

interface CGAssetSearchClientProps {
  cgAssets: CgAsset[];
  cgAssetsPgInfo: PaginatorInfo;
  assetCates: CgAssetCate[];
  assetSearchGenres: CgAssetSearchGenre[];
  assetSearchAppProds: CgAssetSearchAppProd[];
}

export const CGAssetSearchClient: React.FC<CGAssetSearchClientProps> = ({
  cgAssets,
  cgAssetsPgInfo,
  assetCates,
  assetSearchGenres,
  assetSearchAppProds,
}) => {
  // const router = useRouter();
  const { data: session, status } = useSession();
  const rowCount = ROW_COUNT_CGASSETS;

  const storeSearchInfo = useCgAssetsSearchForm();
  const [data, setData] = useState<CgAsset[]>(cgAssets);
  const [paginatorInfo, setPaginatorInfo] = useState<PaginatorInfo>(cgAssetsPgInfo);
  const [searchData, setSearchData] = useState<CgAssetsSearchFormValues>(INIT_CGASSET_SEARCH_FORM_VALUES);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [isInitPage, setIsInitPage] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isNavSideboxClosed, setIsNavSideboxClosed] = useState(false)
  const [isNavHeaderSubmitting, setIsNavHeaderSubmitting] = useState(false)

  useEffect(() => {
    // setLoading(true)
    setIsMounted(true);

    // (async () => {
    //   const ret = await fetchData({
    //     first: rowCount, page: 1, search: storeSearchInfo.cgAssetsSearchFormData, session //as CgAssetsSearchFormValues
    //   })
    //   setData(() => [...ret.data]);
    //   setPaginatorInfo(() => ret.paginatorInfo);
    //   if (_.isEqual(storeSearchInfo.cgAssetsSearchFormData, INIT_CGASSET_SEARCH_FORM_VALUES) === false) {
    //     setIsInitPage(false);
    //   }

    //   setIsMounted(true);
    //   // setLoading(false)
    // })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoadPagenation = useCallback(async (page: number) => {

    const ret = await fetchData({
      first: rowCount,
      page: page,
      search: searchData,
      session
    })
    // console.log(`fetchData ret.paginatorInfo: ${JSON.stringify(ret.paginatorInfo)}`);
    setData(() => [...ret.data]);
    setPaginatorInfo(() => ret.paginatorInfo);
    // setIsInitPage(false)
  }, [rowCount, searchData, session])

  useEffect(() => {
    const f = async () => {
      onLoadPagenation(pageIndex + 1)
    }
    f()
  }, [onLoadPagenation, pageIndex]);

  const onNavHeaderCgAssetsFromSubmit = useCallback(async (data: CgAssetsSearchFormValues) => {
    // console.log(`onNavHeaderCgAssetsFromSubmit data: ${JSON.stringify(data)}`)
    // setLoading(true)
    setIsNavHeaderSubmitting(true)
    setSearchData(data);
    setPageIndex(0);

    const ret = await fetchData({
      first: rowCount,
      page: 1,
      search: data,
      session
    })
    // console.log(`fetchData ret.paginatorInfo: ${JSON.stringify(ret.paginatorInfo)}`);
    setData(() => [...ret.data]);
    setPaginatorInfo(() => ret.paginatorInfo);
    storeSearchInfo.setCgAssetsSearchFormData(data)
    setIsInitPage(false)

    // setLoading(false)
    setIsNavHeaderSubmitting(false)
  }, [rowCount, session, storeSearchInfo]);

  const onNavSideboxCgAssetsFromSubmit = useCallback(async (data: CgAssetsSearchFormValues) => {
    // console.log(`onNavSideboxCgAssetsFromSubmit data: ${JSON.stringify(data)}`)
    // setLoading(true)
    setSearchData(data);
    setPageIndex(0);

    const ret = await fetchData({
      first: rowCount,
      page: 1,
      search: data,
      session
    })
    // console.log(`fetchData ret.paginatorInfo: ${JSON.stringify(ret.paginatorInfo)}`);
    setData(() => [...ret.data]);
    setPaginatorInfo(() => ret.paginatorInfo);
    storeSearchInfo.setCgAssetsSearchFormData(data)
    setIsInitPage(false)

    // setLoading(false)
  }, [rowCount, session, storeSearchInfo]);

  // const onLoadMorePage = async () => {
  //   const page = (paginatorInfo?.currentPage ? paginatorInfo?.currentPage + 1 : 1);
  //   const ret = await fetchData({ first: rowCount, page: page, search: searchData, session })
  //   // console.log(`fetchData ret.paginatorInfo: ${JSON.stringify(ret.paginatorInfo)}`);
  //   setData(() => [...data, ...ret.data]);
  //   setPaginatorInfo(() => ret.paginatorInfo);
  //   setIsInitPage(false)
  // }

  if (!isMounted) {
    return null;
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
          <NavHeaderCgAssets
            searchData={searchData}
            assetCates={assetCates}
            onSearchFromSubmit={onNavHeaderCgAssetsFromSubmit}
          />
        </div>
        <div className="contents">
          <NavSideboxCgAssets
            searchData={searchData}
            assetCates={assetCates}
            assetSearchGenres={assetSearchGenres}
            assetSearchAppProds={assetSearchAppProds}
            onSearchFromSubmit={onNavSideboxCgAssetsFromSubmit}
            setIsNavSideboxClosed={setIsNavSideboxClosed}
            isNavHeaderSubmitting={isNavHeaderSubmitting}
            parentLoading={loading}
          />
          <div className="mainbox">
            <SearchResult
              data={data}
              paginatorInfo={paginatorInfo}
              loading={loading}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              isInitPage={isInitPage}
              // onLoadPagenation={onLoadPagenation}
              // onLoadMorePage={onLoadMorePage}
              isNavSideboxClosed={isNavSideboxClosed}
            />
          </div >
        </div>
      </main>
    </>
  );
};
