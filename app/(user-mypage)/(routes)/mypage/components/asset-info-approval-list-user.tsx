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
  GetApplyDownloadsApplyOrApprovalQuery,
  GetApplyDownloadsApplyOrApprovalDocument,
  ApplyDownload,
  PaginatorInfo,
  ApplyDownloadPaginator,
  StatusApplyDownload,
  SectionApplyDownload
} from "@/graphql/generated/graphql";
import { MyPagenator } from "@/components/ui/pagenator";
import { ROW_COUNT } from "@/lib/pagenation";
import { checkGlacierStatus } from "@/lib/check-glacier-status";
import ApplyDownloadDialog from "./apply-download-dialog";

interface AssetInfoApprovalListUserProps {
  searchRef: Ref<{ handleSearch(txt: string): void; } | undefined>
  approvals: ApplyDownload[]
  approvalsPg: ApplyDownloadPaginator['paginatorInfo']
}

const AssetInfoApprovalListUser: React.FC<AssetInfoApprovalListUserProps> = forwardRef(({
  approvals,
  approvalsPg
}, searchRef) => {
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(approvals);
  const [pgInfo, setPgInfo] = useState(approvalsPg);

  const rowCount = ROW_COUNT;

  const [pageIndex, setPageIndex] = useState(approvalsPg.currentPage - 1);
  const [pageCount, setPageCount] = useState(Math.ceil(approvalsPg.total / rowCount));
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

    const ret: ApolloQueryResult<GetApplyDownloadsApplyOrApprovalQuery>
      = await apolloClient
        .query({
          query: GetApplyDownloadsApplyOrApprovalDocument,
          variables: {
            apply_user_id: (session?.user as { userId: string }).userId,
            first: rowCount,
            page: param.page, // pageIndex + 1,
            order: param.order, // order,
            orderAsc: (param.orderAsc ? 'ASC' : 'DESC'), // (orderAsc ? 'ASC' : 'DESC'),
            section_adl: SectionApplyDownload.ApprovalUser,
            searchTxt: param.searchTxt, // searchTxt
          }
        });
    setItems(() => ret.data.ApplyDownloadsApplyOrApproval.data as ApplyDownload[]);
    setPgInfo(() => ret.data.ApplyDownloadsApplyOrApproval.paginatorInfo as PaginatorInfo);
    setPageCount(() => Math.ceil(ret.data.ApplyDownloadsApplyOrApproval.paginatorInfo.total / rowCount));

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
            <TableHead></TableHead>
          </TableRow>
          {items && items.map((elem: ApplyDownload | null) => {

            if (elem) {

              let action = "[-未使用-]"
              switch (elem.status) {
                case StatusApplyDownload.Apply: // 申請中
                  action = "承認待ち"

                  return <TableRow key={elem.id}>
                    <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
                    <TableCell>{elem.cgAsset.asset_id}</TableCell>
                    <TableCell>{elem.cgAsset.asset_name}</TableCell>
                    <TableCell>
                      {action}
                    </TableCell>
                  </TableRow>

                case StatusApplyDownload.Approval: // 承認済
                  action = "承認済み"

                  return <TableRow key={elem.id}>
                    <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
                    <TableCell>{elem.cgAsset.asset_id}</TableCell>
                    <TableCell>{elem.cgAsset.asset_name}</TableCell>
                    <TableCell>
                      {action}
                    </TableCell>
                  </TableRow>

                  break;
                case StatusApplyDownload.BoxDeliver: // Boxリンク通知

                  if (checkGlacierStatus([elem]) <= 0) {

                    if (checkGlacierStatus([elem]) === 0) {
                      action = "DL準備中"
                    } else {
                      action = "DL対象なし"
                    }

                    return <TableRow key={elem.id}>
                      <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
                      <TableCell>{elem.cgAsset.asset_id}</TableCell>
                      <TableCell>{elem.cgAsset.asset_name}</TableCell>
                      <TableCell>
                        {action}
                      </TableCell>
                    </TableRow>
                  }

                  action = "ダウンロード"
                  break;
                case StatusApplyDownload.DlNotice: // DL済み通知
                  action = "データ消去報告"
                  break;
                case StatusApplyDownload.Removal: // データ削除期限
                  action = "データ消去報告"
                  break;
                case StatusApplyDownload.Done: // データ消去完了
                case StatusApplyDownload.BoxReady: // リンク準備完了
                default:
                  break;
              }

              return <TableRow key={elem.id}>
                <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
                <TableCell>{elem.cgAsset.asset_id}</TableCell>
                <TableCell>{elem.cgAsset.asset_name}</TableCell>
                <TableCell>
                  <ApplyDownloadDialog
                    cgAssetId={elem.cgAsset.id}
                    applyDownloadId={elem.id}
                    action={action}
                    className="tag_gray on"
                  />
                </TableCell>
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
AssetInfoApprovalListUser.displayName = "AssetInfoApprovalListUser";

export default AssetInfoApprovalListUser