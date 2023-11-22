import { useState } from "react";
import Link from "next/link"
import Image from 'next/image';
import classNames from "classnames";
import ReactPaginate from 'react-paginate';

import { CgAsset, PaginatorInfo } from '@/graphql/generated/graphql';

import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import paginateStyles from "@/styles/components/paginate-block.module.scss";
import { ROW_COUNT_CGASSETS } from "@/lib/pagenation";

import { getAssetMedias } from "../page-detail/asset-media";

interface SearchResultProps {
  data: CgAsset[];
  paginatorInfo: PaginatorInfo | null;
  loading: boolean;
  isInitPage: boolean;
  onLoadPagenation: (params: { page: number }) => Promise<void>;
  onLoadMorePage: () => Promise<void>;
  isNavSideboxClosed: boolean;
}

export const SearchResult: React.FC<SearchResultProps> = ({
  data,
  paginatorInfo,
  loading,
  isInitPage,
  onLoadPagenation,
  onLoadMorePage,
  isNavSideboxClosed,
}) => {
  const [loadingChild, setLoadingChild] = useState(false);

  const rowCount = ROW_COUNT_CGASSETS;

  const [pageIndex, setPageIndex] = useState((paginatorInfo?.currentPage || 1) - 1);
  const pageCount = Math.ceil((paginatorInfo?.total || 0) / rowCount);

  const targetPage = async (newIndex) => {
    setLoadingChild(true);

    setPageIndex(() => newIndex);
    // console.log(`targetPage pageIndex:${pageIndex}`);
    await onLoadPagenation({
      page: newIndex + 1,
    });

    setLoadingChild(false);
  }

  const getCanPreviousPage = () => {
    if (pageIndex < 1) {
      return false;
    }
    return true;
  }

  const getCanNextPage = () => {
    if (pageIndex >= pageCount - 1) {
      return false;
    }
    return true;
  }

  const handlePageClick = async (data) => {
    setLoadingChild(true);

    setPageIndex(() => data.selected);
    // console.log(`handlePageClick pageIndex:${pageIndex}`);
    await onLoadPagenation({
      page: data.selected + 1,
    });

    setLoadingChild(false);
  }

  return (
    <>
      {/* <div className="h-16 items-center px-4">
        {loading ? '検索中...' :
          (
            paginatorInfo && !isInitPage ?
              '検索されたアセット (' + paginatorInfo.total + ')' :
              '最新アセット'
          )}
      </div> */}
      {loading || loadingChild ? (
        <div className={classNames({
          "mainbox__inner":
            true,
          "inner-hidelist": isNavSideboxClosed === true,
        })} style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: isNavSideboxClosed === true ? 'calc(100vw - 3.125vw)' : 'calc(100vw - 3.125vw - 12.5vw)',
          marginTop: '15rem'
        }}>
          <Loader />
        </div>
      ) : (
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
            {data.map((elem: CgAsset) => {

              const { mediaDesc, medias, notFound } = getAssetMedias(elem);

              return <li key={elem.id}>
                <Link key={elem.id} href={`/c_g_assets/${elem.id}`}>
                  {medias ? (
                    <>
                      {/* <div style={{ width: "500", height: "276", position: "relative" }}> */}
                      <span className="mainbox__category">{mediaDesc}</span>
                      <Image
                        src={(medias && medias[0] ? medias[0].thumb_url as string : notFound)}
                        alt={elem.asset_id}
                        width={360}
                        height={203}
                        decoding="async"
                      />
                      <p>{elem.asset_name}</p>
                      {/* <p style={{ position: "absolute", top: "9.3rem", left: "0.6rem", width: "19.0rem", textAlign: "right", zIndex: 40, color: "white", textShadow: "1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000", height: "2.0rem" }}>DL数:{elem.download_count}</p>
                      </div> */}
                    </>
                  ) : elem.asset_id}
                </Link>
              </li>
            })}
          </ul>
          {!loading && !isInitPage && paginatorInfo && (
            <div className={paginateStyles.paginateBlock}>
              <div className="flow-root h-16 items-center px-4 my-4">
                <div className="float-right flex items-center space-x-4">
                  <div className="flex items-center gap-2 mt-3">
                    {pageCount > 0 && (
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => targetPage(0)}
                        disabled={!getCanPreviousPage()}
                      >
                        {'<<'}
                      </Button>
                    )}
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=">"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel="<"
                      renderOnZeroPageCount={undefined}
                      breakClassName=""
                      breakLinkClassName=""
                      containerClassName="flex items-center gap-2"
                      activeClassName="opacity-50"
                      disabledClassName="disabled"
                      forcePage={pageIndex}
                    />
                    {pageCount > 0 && (
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => targetPage(pageCount - 1)}
                        disabled={!getCanNextPage()}
                      >
                        {'>>'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* {!loading && !isInitPage && paginatorInfo && paginatorInfo.hasMorePages && (
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
      )} */}
        </div >
      )}
    </>
  )
}
