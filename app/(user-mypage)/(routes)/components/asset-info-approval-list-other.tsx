"use client";

import { Ref, forwardRef, useEffect, useState, useImperativeHandle } from "react"
import { useSession } from "next-auth/react"
import ReactPaginate from 'react-paginate';
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
} from "@/components/ui/table"
import {
  GetApplyDownloadsApplyOrApprovalQuery,
  GetApplyDownloadsApplyOrApprovalDocument,
  ApplyDownload,
  PaginatorInfo,
  ApplyDownloadPaginator,
  StatusApplyDownload
} from "@/graphql/generated/graphql";
import { ROW_COUNT } from "@/lib/pagenation";
import paginateStyles from "@/styles/components/paginate-block.module.scss";
import { checkGlacierStatus } from "@/lib/check-glacier-status";
import ApplyDownloadDialog from "./apply-download-dialog";

interface AssetInfoApprovalListOtherProps {
  searchRef: Ref<{ handleSearch(txt: string): void; } | undefined>
  approvals: ApplyDownload[]
  approvalsPg: ApplyDownloadPaginator['paginatorInfo']
}

const AssetInfoApprovalListOther: React.FC<AssetInfoApprovalListOtherProps> = forwardRef(({
  searchRef,
  approvals,
  approvalsPg
}) => {
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

  const fetchData = async (param) => {
    setLoading(true)

    const ret: ApolloQueryResult<GetApplyDownloadsApplyOrApprovalQuery>
      = await apolloClient
        .query({
          query: GetApplyDownloadsApplyOrApprovalDocument,
          variables: {
            user_id: (session?.user as { userId: string }).userId,
            first: rowCount,
            page: param.page, // pageIndex + 1,
            order: param.order, // order,
            orderAsc: (param.orderAsc ? 'ASC' : 'DESC'), // (orderAsc ? 'ASC' : 'DESC'),
            section_adl: 'APPROVAL_OTHER',
            searchTxt: param.searchTxt, // searchTxt
          }
        });
    setItems(() => ret.data.ApplyDownloadsApplyOrApproval.data as ApplyDownload[]);
    setPgInfo(() => ret.data.ApplyDownloadsApplyOrApproval.paginatorInfo as PaginatorInfo);
    setPageCount(() => Math.ceil(ret.data.ApplyDownloadsApplyOrApproval.paginatorInfo.total / rowCount));

    setLoading(false)
  }

  const targetPage = async (newIndex) => {
    setPageIndex(() => newIndex);
    // console.log(`targetPage pageIndex:${pageIndex}`);
    await fetchData({
      page: newIndex + 1,
      order: order,
      orderAsc: orderAsc,
      searchTxt: searchTxt,
    });
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
    // console.log(`handlePageClick pageIndex:${pageIndex}`);
    await fetchData({
      page: data.selected + 1,
      order: order,
      orderAsc: orderAsc,
      searchTxt: searchTxt,
    });
  }

  const handleSort = async (column: string) => {
    setOrder(() => column);
    // console.log(`handleSort order:${order}`);
    setOrderAsc((_orderAsc) => !_orderAsc);
    // console.log(`handleSort orderAsc:${orderAsc}`);
    setPageIndex(() => 0);
    // console.log(`handleSort pageIndex:${pageIndex}`);
    await fetchData({
      page: 1,
      order: column,
      orderAsc: orderAsc,
      searchTxt: searchTxt,
    });
  }

  useImperativeHandle(searchRef, () => ({

    handleSearch: async (txt: string) => {
      // console.log(`child handleSearch txt:${txt}`);
      setSearchTxt(() => txt);
      // console.log(`child handleSearch searchTxt:${searchTxt}`);
      setOrder('');
      // console.log(`handleSort order:${order}`);
      setOrderAsc(true);
      // console.log(`handleSort orderAsc:${orderAsc}`);
      setPageIndex(() => 0);
      // console.log(`child handleSearch pageIndex:${pageIndex}`);
      await fetchData({
        page: 1,
        order: null,
        orderAsc: null,
        searchTxt: txt,
      });
    }

  }));

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <Loader />
    </div>;
  }

  return (
    <>
      <Table>
        <TableCaption>承認一覧</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead onClick={(e) => handleSort('apply_downloads.created_at')} className="w-[100px]">Date</TableHead>
            <TableHead onClick={(e) => handleSort('cgAsset.asset_id')}>Asset ID</TableHead>
            <TableHead onClick={(e) => handleSort('cgAsset.asset_name')}>Asset Name</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items && items.map((elem: ApplyDownload | null) => {

            if (elem) {

              let action = "次へ"
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
                    variant="default"
                  />
                </TableCell>
              </TableRow>
            }

          })}
        </TableBody>
      </Table>
      <div className={paginateStyles.paginateBlock}>
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
    </>
  )
});
AssetInfoApprovalListOther.displayName = "AssetInfoApprovalListOther";

export default AssetInfoApprovalListOther