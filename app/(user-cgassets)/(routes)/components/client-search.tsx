"use client";

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
// import { Plus } from "lucide-react";
// import { useRouter } from "next/navigation";
import _ from 'lodash';

import {
  CgAsset,
  CgAssetCate,
  CgAssetSearchAppProd,
  CgAssetSearchTag,
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
  assetCates: CgAssetCate[];
  assetSearchTags: CgAssetSearchTag[];
  assetSearchAppProds: CgAssetSearchAppProd[];
}

export const CGAssetSearchClient: React.FC<CGAssetSearchClientProps> = ({
  assetCates,
  assetSearchTags,
  assetSearchAppProds,
}) => {
  // const router = useRouter();
  const { data: session, status } = useSession();
  const rowCount = ROW_COUNT_CGASSETS;

  const storeSearchInfo = useCgAssetsSearchForm();
  const [data, setData] = useState<CgAsset[]>([]);
  const [paginatorInfo, setPaginatorInfo] = useState<PaginatorInfo | null>(null);
  const [searchData, setSearchData] = useState<CgAssetsSearchFormValues>(INIT_CGASSET_SEARCH_FORM_VALUES);
  const [loading, setLoading] = useState(true);
  const [isInitPage, setIsInitPage] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isNavSideboxClosed, setIsNavSideboxClosed] = useState(false)
  const [isNavHeaderSubmitting, setIsNavHeaderSubmitting] = useState(false)

  useEffect(() => {
    setIsMounted(true);

    (async () => {
      const ret = await fetchData({
        first: rowCount, page: 1, search: storeSearchInfo.cgAssetsSearchFormData, session //as CgAssetsSearchFormValues
      })
      setData(() => [...ret.data]);
      setPaginatorInfo(() => ret.paginatorInfo);
      if (_.isEqual(storeSearchInfo.cgAssetsSearchFormData, INIT_CGASSET_SEARCH_FORM_VALUES) === false) {
        setIsInitPage(false)
      }

      setLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return null;
  }

  const onNavHeaderCgAssetsFromSubmit = async (data: CgAssetsSearchFormValues) => {
    // console.log(`onNavHeaderCgAssetsFromSubmit data: ${JSON.stringify(data)}`)
    setLoading(true)
    setIsNavHeaderSubmitting(true)
    setSearchData(data);

    const ret = await fetchData({ first: rowCount, page: 1, search: data, session })
    // console.log(`fetchData ret.paginatorInfo: ${JSON.stringify(ret.paginatorInfo)}`);
    setData(() => [...ret.data]);
    setPaginatorInfo(() => ret.paginatorInfo);
    storeSearchInfo.setCgAssetsSearchFormData(data)
    setIsInitPage(false)

    setLoading(false)
    setIsNavHeaderSubmitting(false)
  }

  const onNavSideboxCgAssetsFromSubmit = async (data: CgAssetsSearchFormValues) => {
    // console.log(`onNavSideboxCgAssetsFromSubmit data: ${JSON.stringify(data)}`)
    setLoading(true)
    setSearchData(data);

    const ret = await fetchData({ first: rowCount, page: 1, search: data, session })
    // console.log(`fetchData ret.paginatorInfo: ${JSON.stringify(ret.paginatorInfo)}`);
    setData(() => [...ret.data]);
    setPaginatorInfo(() => ret.paginatorInfo);
    storeSearchInfo.setCgAssetsSearchFormData(data)
    setIsInitPage(false)

    setLoading(false)
  }

  const onLoadPagenation = async ({ page }) => {
    const ret = await fetchData({ first: rowCount, page: page, search: searchData, session })
    // console.log(`fetchData ret.paginatorInfo: ${JSON.stringify(ret.paginatorInfo)}`);
    setData(() => [...ret.data]);
    setPaginatorInfo(() => ret.paginatorInfo);
    setIsInitPage(false)
  }

  const onLoadMorePage = async () => {
    const page = (paginatorInfo?.currentPage ? paginatorInfo?.currentPage + 1 : 1);
    const ret = await fetchData({ first: rowCount, page: page, search: searchData, session })
    // console.log(`fetchData ret.paginatorInfo: ${JSON.stringify(ret.paginatorInfo)}`);
    setData(() => [...data, ...ret.data]);
    setPaginatorInfo(() => ret.paginatorInfo);
    setIsInitPage(false)
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
            assetSearchTags={assetSearchTags}
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
              isInitPage={isInitPage}
              onLoadPagenation={onLoadPagenation}
              onLoadMorePage={onLoadMorePage}
              isNavSideboxClosed={isNavSideboxClosed}
            />
          </div >
        </div>
      </main>
    </>
  );
};
