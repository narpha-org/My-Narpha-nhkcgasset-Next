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
  GetApplyDownloadsNotDoneQuery,
  GetApplyDownloadsNotDoneDocument,
  ApplyDownload,
  PaginatorInfo,
  ApplyDownloadPaginator,
  StatusApplyDownload,
  SectionApplyDownload
} from "@/graphql/generated/graphql";
import { ROW_COUNT } from "@/lib/pagenation";
import paginateStyles from "@/styles/components/paginate-block.module.scss";

import ApplyDownloadDialog from "./apply-download-dialog";

interface AssetInfoApplyDownloadAdminProps {
  searchRef: Ref<{ handleSearch(txt: string): void; } | undefined>
  downloadApplies: ApplyDownload[]
  downloadAppliesPg: ApplyDownloadPaginator['paginatorInfo']
}

const AssetInfoApplyDownloadAdmin: React.FC<AssetInfoApplyDownloadAdminProps> = forwardRef(({
  searchRef,
  downloadApplies,
  downloadAppliesPg,
}) => {
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(downloadApplies);
  const [pgInfo, setPgInfo] = useState(downloadAppliesPg);

  const rowCount = ROW_COUNT;

  const [pageIndex, setPageIndex] = useState(downloadAppliesPg.currentPage - 1);
  const [pageCount, setPageCount] = useState(Math.ceil(downloadAppliesPg.total / rowCount));
  const [order, setOrder] = useState('');
  const [orderAsc, setOrderAsc] = useState(true);
  const [searchTxt, setSearchTxt] = useState('');

  useEffect(() => {
    setLoading(false)
  }, [])

  const fetchData = async (param) => {
    setLoading(true)

    const ret: ApolloQueryResult<GetApplyDownloadsNotDoneQuery>
      = await apolloClient
        .query({
          query: GetApplyDownloadsNotDoneDocument,
          variables: {
            create_user_id: (session?.user as { userId: string }).userId,
            first: rowCount,
            page: param.page, // pageIndex + 1,
            order: param.order, // order,
            orderAsc: (param.orderAsc ? 'ASC' : 'DESC'), // (orderAsc ? 'ASC' : 'DESC'),
            section_adl: SectionApplyDownload.AdlAdmin,
            searchTxt: param.searchTxt, // searchTxt
          }
        });
    setItems(() => ret.data.ApplyDownloadsNotDone.data as ApplyDownload[]);
    setPgInfo(() => ret.data.ApplyDownloadsNotDone.paginatorInfo as PaginatorInfo);
    setPageCount(() => Math.ceil(ret.data.ApplyDownloadsNotDone.paginatorInfo.total / rowCount));

    setLoading(false)
  }

  const nextPage = async () => {
    setPageIndex((prePageIndex) => prePageIndex + 1);
    // console.log(`nextPage pageIndex:${pageIndex}`);
    await fetchData({
      page: pageIndex + 2,
      order: order,
      orderAsc: orderAsc,
      searchTxt: searchTxt,
    });
  }

  const previousPage = async () => {
    setPageIndex((prePageIndex) => prePageIndex - 1);
    // console.log(`previousPage pageIndex:${pageIndex}`);
    await fetchData({
      page: pageIndex,
      order: order,
      orderAsc: orderAsc,
      searchTxt: searchTxt,
    });
  }

  const targetPage = async (newIndex) => {
    setPageIndex(() => newIndex);
    // console.log(`targetPage pageIndex:${pageIndex}`);
    await fetchData({
      page: newIndex,
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
        <TableHeader>
          <TableRow>
            <TableHead onClick={(e) => handleSort('apply_downloads.created_at')} className="w-[100px]">Date</TableHead>
            <TableHead onClick={(e) => handleSort('cgAsset.asset_id')}>Asset ID</TableHead>
            <TableHead onClick={(e) => handleSort('cgAsset.asset_name')}>Asset Name</TableHead>
            <TableHead onClick={(e) => handleSort('applyUser.name')}>申請者</TableHead>
            <TableHead onClick={(e) => handleSort('manageUser.name')}>申請許可者</TableHead>
            <TableHead onClick={(e) => handleSort('apply_downloads.status')} className="">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items && items.map((elem: ApplyDownload | null) => {

            if (elem) {

              let action = "-次へ-"
              switch (elem.status) {
                case StatusApplyDownload.Apply: // 申請中
                  action = "申請中"
                  break;
                case StatusApplyDownload.Approval: // 承認済
                  action = "承認許可"
                  break;
                case StatusApplyDownload.BoxDeliver: // Boxリンク通知
                  action = "DL済み通知"
                  break;
                case StatusApplyDownload.DlNotice: // DL済み通知
                  action = "データ削除期限"
                  break;
                case StatusApplyDownload.Removal: // データ削除期限
                  action = "データ削除済み"
                  break;
                default:
                  break;
              }

              return <TableRow key={elem.id}>
                <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
                <TableCell>{elem.cgAsset.asset_id}</TableCell>
                <TableCell>{elem.cgAsset.asset_name}</TableCell>
                <TableCell>{elem.applyUser?.name}</TableCell>
                <TableCell>{elem.manageUser?.name}</TableCell>
                <TableCell>
                  <ApplyDownloadDialog
                    cgAssetId={elem.cgAsset.id}
                    applyDownloadId={elem.id}
                    action={action}
                    variant="outline"
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

      {/* <div className={paginateStyles.paginateBlock}>
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
        <Button
          variant="default"
          size="icon"
          onClick={() => previousPage()}
          disabled={!getCanPreviousPage()}
        >
          {'<'}
        </Button>
        {pageCount && [...Array(pageCount)].map((value, i) => {

          if (
            i < 3 ||
            i >= pageCount - 3 ||
            Math.abs(i - pageIndex) < 3
          ) {
            return (
              <Button
                key={i}
                variant="outline"
                size="icon"
                onClick={() => targetPage(i)}
                disabled={i === pageIndex}
              >
                {i + 1}
              </Button>
            )
          } else if (
            (i === 4 && pageCount > 7) ||
            (i === pageCount - 4 && pageCount > 7)
          ) {
            return <div key={`x${i}`}>...</div>
          }

          return null
        })}
        <Button
          variant="default"
          size="icon"
          onClick={() => nextPage()}
          disabled={!getCanNextPage()}
        >
          {'>'}
        </Button>
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
      </div> */}
    </>
  )
});
AssetInfoApplyDownloadAdmin.displayName = "AssetInfoApplyDownloadAdmin";

export default AssetInfoApplyDownloadAdmin