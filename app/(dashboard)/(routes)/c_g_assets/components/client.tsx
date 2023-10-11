"use client";

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from 'next/image';

import { CgAsset, CgAssetCate, PaginatorInfo } from '@/graphql/generated/graphql';
import { useSearchForm, CGAssetSearchFormValues, INIT_CGASSET_SEARCH_FORM_VALUES } from "@/hooks/use-search-form";

import { fetchData } from './fetch-data';
import { SearchForm } from './search-form';
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";

interface CGAssetClientProps {
  assetCates: CgAssetCate[];
}

export const CGAssetClient: React.FC<CGAssetClientProps> = ({
  assetCates
}) => {
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
        first: 10, page: 1, search: storeSearchInfo.searchFormData //as CGAssetSearchFormValues
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

    const ret = await fetchData({ first: 10, page: 1, search: data })
    setData(ret.data);
    setPaginatorInfo(ret.paginatorInfo);
    storeSearchInfo.setSearchFormData(data)
    setIsInitPage(false)

    setLoading(false)
  }

  const onLoadMorePage = async () => {

    const page = (paginatorInfo?.currentPage ? paginatorInfo?.currentPage + 1 : 1);

    const ret = await fetchData({ first: 10, page: page, search: searchData })
    setData([...data, ...ret.data]);
    setPaginatorInfo(ret.paginatorInfo);
    setIsInitPage(false)
  }

  return (
    <>
      <div className="basis-1/4">
        <div className="h-16 items-center px-4">
          検索
        </div>
        <div className="items-center px-4">
          <SearchForm assetCates={assetCates} onSearchFromSubmit={onSearchFromSubmit} />
        </div>
      </div>
      <div className="basis-3/4">
        <div className="h-16 items-center px-4">
          {loading ? '検索中...' :
            (
              paginatorInfo && !isInitPage ?
                '検索されたアセット (' + paginatorInfo.total + ')' :
                '最新アセット'
            )}
        </div>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-3 grid-rows-3 px-4">
            {data.map((elem: CgAsset) => {
              return <div key={elem.id}>
                <Link key={elem.id} href={`/c_g_assets/${elem.id}`}>
                  {elem.assetImages ? (
                    <>
                      <Image
                        src={(elem.assetImages && elem.assetImages[0] ? elem.assetImages[0].thumb_url as string : "/images/asset_image_notfound.png")}
                        alt={elem.asset_id}
                        width={500}
                        height={276}
                      />
                      <p style={{ marginTop: "-1.9rem", marginLeft: "0.6rem", zIndex: 100, color: "white" }}>{elem.asset_id}</p>
                    </>
                  ) : null}
                </Link>
              </div>
            })}
          </div>
        )}
        {!loading && !isInitPage && paginatorInfo && paginatorInfo.hasMorePages && (
          <div className="flow-root h-16 items-center px-4 my-4">
            <div className="float-right flex items-center space-x-4">
              <Button
                type="button"
                variant="secondary"
                disabled={loading}
                onClick={onLoadMorePage}
              >さらに読み込む</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
