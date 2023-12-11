"use client";

import { Ref, forwardRef, useEffect, useState, useImperativeHandle, useCallback } from "react"
import Image from 'next/image'
import { useSession } from "next-auth/react"
// import ReactPaginate from 'react-paginate';
import { format } from 'date-fns'

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-raw"
import {
  GetApplyDownloadsOnlyApplyQuery,
  GetApplyDownloadsOnlyApplyDocument,
  ApplyDownload,
  PaginatorInfo,
  ApplyDownloadPaginator,
  // StatusApplyDownload,
  SectionApplyDownload
} from "@/graphql/generated/graphql";
import { MyPagenator } from "@/components/ui/pagenator";
import { ROW_COUNT } from "@/lib/pagenation";
import { formatStatusApplyDownload } from "@/lib/enums";

interface AssetInfoApplyListOtherProps {
  searchRef: Ref<{ handleSearch(txt: string): void; } | undefined>
  applies: ApplyDownload[]
  appliesPg: ApplyDownloadPaginator['paginatorInfo']
}

const AssetInfoApplyListOther: React.FC<AssetInfoApplyListOtherProps> = forwardRef(({
  applies,
  appliesPg
}, searchRef) => {
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(applies);
  const [pgInfo, setPgInfo] = useState(appliesPg);

  const rowCount = ROW_COUNT;

  const [pageIndex, setPageIndex] = useState(appliesPg.currentPage - 1);
  const [pageCount, setPageCount] = useState(Math.ceil(appliesPg.total / rowCount));
  const [order, setOrder] = useState('');
  const [orderAsc, setOrderAsc] = useState(true);
  const [searchTxt, setSearchTxt] = useState('');

  useEffect(() => {
    setLoading(false)
  }, [])

  const fetchData = useCallback(async (param) => {
    if (!session?.user) {
      return;
    }

    setLoading(true)

    const ret: ApolloQueryResult<GetApplyDownloadsOnlyApplyQuery>
      = await apolloClient
        .query({
          query: GetApplyDownloadsOnlyApplyDocument,
          variables: {
            apply_user_id: (session?.user as { userId: string }).userId,
            first: rowCount,
            page: param.page, // pageIndex + 1,
            order: param.order, // order,
            orderAsc: (param.orderAsc ? 'ASC' : 'DESC'), // (orderAsc ? 'ASC' : 'DESC'),
            section_adl: SectionApplyDownload.ApplyOther,
            searchTxt: param.searchTxt, // searchTxt
          }
        });
    setItems(() => ret.data.ApplyDownloadsOnlyApply.data as ApplyDownload[]);
    setPgInfo(() => ret.data.ApplyDownloadsOnlyApply.paginatorInfo as PaginatorInfo);
    setPageCount(() => Math.ceil(ret.data.ApplyDownloadsOnlyApply.paginatorInfo.total / rowCount));

    setLoading(false)
  }, [rowCount, session?.user]);

  useEffect(() => {
    const f = async () => {
      await fetchData({
        page: pageIndex + 1,
        order: order,
        orderAsc: orderAsc,
        searchTxt: searchTxt,
      });
    }
    f();
  }, [fetchData, pageIndex, order, orderAsc, searchTxt])

  const targetPage = async (newIndex) => {
    setPageIndex(() => newIndex);
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
    setPageIndex(() => data.selected);
  }

  const handleSort = async (column: string) => {
    setOrder(() => column);
    setOrderAsc((_orderAsc) => !_orderAsc);
    setPageIndex(() => 0);
  }

  useImperativeHandle(searchRef, () => ({

    handleSearch: async (txt: string) => {
      setSearchTxt(() => txt);
      setOrder('');
      setOrderAsc(true);
      setPageIndex(() => 0);
    }

  }));

  if (loading) {
    // return <div className="flex items-center justify-center h-96">
    //   <Loader />
    // </div>;
  }

  return (
    <>
      <Table className="mypage__mainlist">
        <TableBody>
          <TableRow className="top">
            <TableHead className="sortable w-[100px]" onClick={(e) => handleSort('apply_downloads.created_at')}>Date</TableHead>
            <TableHead className="sortable" onClick={(e) => handleSort('cgAsset.asset_id')}>Asset ID</TableHead>
            <TableHead className="sortable asset_name" onClick={(e) => handleSort('cgAsset.asset_name')}>Asset Name</TableHead>
            <TableHead className="sortable" onClick={(e) => handleSort('apply_downloads.status')}>Status</TableHead>
          </TableRow>
          {items && items.map((elem: ApplyDownload | null) => {

            if (elem) {
              return <TableRow key={elem.id}>
                <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
                <TableCell>{elem.cgAsset.asset_id}</TableCell>
                <TableCell>{elem.cgAsset.asset_name}</TableCell>
                <TableCell>{formatStatusApplyDownload(elem.status)}</TableCell>
              </TableRow>
            }

          })}
        </TableBody>
      </Table>
      <MyPagenator
        className="mypage__pagenation"
        pageIndex={pageIndex}
        pageCount={pageCount}
        handlePageClick={handlePageClick}
        targetPage={targetPage}
        getCanPreviousPage={getCanPreviousPage}
        getCanNextPage={getCanNextPage}
      />
      {/* <div className="mypage__pagenation">
        {pageCount > 0 && (
          <div className="prev">
            <Button
              onClick={() => targetPage(0)}
              disabled={!getCanPreviousPage()}
            >
              <Image src="/assets/images/prev02.svg" width="19" height="22" decoding="async" alt="最初のページへ" />
            </Button>
          </div>
        )}
        <ReactPaginate
          breakLabel={`・・・`}
          nextLabel={<Image src="/assets/images/next01.svg" width="19" height="22"
            decoding="async" alt="次のページへ" />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel={<Image src="/assets/images/prev01.svg" width="19" height="22"
            decoding="async" alt="前のページへ" />}
          renderOnZeroPageCount={undefined}
          breakClassName="ellipsis"
          breakLinkClassName=""
          containerClassName="ul_alt"
          activeClassName="opacity-50"
          disabledClassName="disabled"
          forcePage={pageIndex}
        />
        {pageCount > 0 && (
          <div className="next">
            <Button
              onClick={() => targetPage(pageCount - 1)}
              disabled={!getCanNextPage()}
            >
              <Image src="/assets/images/next02.svg" width="19" height="22" decoding="async" alt="最後のページへ" />
            </Button>
          </div>
        )}
      </div> */}
    </>
  )
});
AssetInfoApplyListOther.displayName = "AssetInfoApplyListOther";

export default AssetInfoApplyListOther