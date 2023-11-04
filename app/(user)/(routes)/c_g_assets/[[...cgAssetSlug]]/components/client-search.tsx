"use client";

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CgAsset,
  CgAssetCate,
  CgAssetSearchAppProd,
  CgAssetSearchTag,
  PaginatorInfo
} from '@/graphql/generated/graphql';
import {
  useSearchForm,
  CGAssetSearchFormValues,
  INIT_CGASSET_SEARCH_FORM_VALUES
} from "@/hooks/use-search-form";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { fetchData } from './page-search/fetch-data';
import { SearchForm } from './page-search/search-form';
import { Button } from "@/components/ui/button";
import SearchResult from "./page-search/search-result";
import { IsRoleUser } from "@/lib/check-role-client";

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
  const router = useRouter();
  const { data: session, status } = useSession();

  const storeSearchInfo = useSearchForm();
  const [data, setData] = useState<CgAsset[]>([]);
  const [paginatorInfo, setPaginatorInfo] = useState<PaginatorInfo | null>(null);
  const [searchData, setSearchData] = useState<CGAssetSearchFormValues>(INIT_CGASSET_SEARCH_FORM_VALUES);
  const [loading, setLoading] = useState(true);
  const [isInitPage, setIsInitPage] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    (async () => {
      const ret = await fetchData({
        first: 10, page: 1, search: storeSearchInfo.searchFormData, session //as CGAssetSearchFormValues
      })
      setData(ret.data);
      setPaginatorInfo(ret.paginatorInfo);
      if (storeSearchInfo.searchFormData !== INIT_CGASSET_SEARCH_FORM_VALUES) {
        setIsInitPage(false)
      }

      setLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return null;
  }

  const onSearchFromSubmit = async (data: CGAssetSearchFormValues) => {
    setLoading(true)
    setSearchData(data);

    const ret = await fetchData({ first: 10, page: 1, search: data, session })
    setData(ret.data);
    setPaginatorInfo(ret.paginatorInfo);
    storeSearchInfo.setSearchFormData(data)
    setIsInitPage(false)

    setLoading(false)
  }

  const onLoadMorePage = async () => {

    const page = (paginatorInfo?.currentPage ? paginatorInfo?.currentPage + 1 : 1);

    const ret = await fetchData({ first: 10, page: page, search: searchData, session })
    setData([...data, ...ret.data]);
    setPaginatorInfo(ret.paginatorInfo);
    setIsInitPage(false)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="CGアセット一覧" description="" />
        {/* {!IsRoleUser(session) && (
          <Button onClick={() => router.push(`/c_g_assets/new`)}>
            <Plus className="mr-2 h-4 w-4" /> アセット追加
          </Button>
        )} */}
      </div>
      <Separator />
      <div className="flex flex-row">
        <div className="basis-1/4">
          <div className="h-16 items-center px-4">
            検索
          </div>
          <div className="items-center px-4">
            <SearchForm
              assetCates={assetCates}
              assetSearchTags={assetSearchTags}
              assetSearchAppProds={assetSearchAppProds}
              onSearchFromSubmit={onSearchFromSubmit}
            />
          </div>
        </div>
        <div className="basis-3/4">
          <SearchResult
            data={data}
            paginatorInfo={paginatorInfo}
            loading={loading}
            isInitPage={isInitPage}
            onLoadMorePage={onLoadMorePage}
          />
        </div >
      </div>
    </>
  );
};
