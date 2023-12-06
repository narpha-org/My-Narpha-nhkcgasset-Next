"use client";

import { Ref, forwardRef, useEffect, useState, useImperativeHandle } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"
import ReactPaginate from 'react-paginate';
import { format } from 'date-fns'

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { AlertModal } from "@/components/modals/alert-modal"
import {
  GetCgAssetsCreatedAllQuery,
  GetCgAssetsCreatedAllDocument,
  CgAsset,
  PaginatorInfo,
  CgAssetPaginator,
  DeleteCgAssetMutation,
  DeleteCgAssetDocument,
} from "@/graphql/generated/graphql";
import { ROW_COUNT } from "@/lib/pagenation";
import paginateStyles from "@/styles/components/paginate-block.module.scss";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AssetRegisterdListProps {
  searchRef: Ref<{ handleSearch(txt: string): void; } | undefined>
  cgAssets: CgAsset[]
  cgAssetsPg: CgAssetPaginator['paginatorInfo']
  cgAssetsSearchSection: string
}

const AssetRegisterdList: React.FC<AssetRegisterdListProps> = forwardRef(({
  searchRef,
  cgAssets,
  cgAssetsPg,
  cgAssetsSearchSection,
}) => {
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(cgAssets);
  const [pgInfo, setPgInfo] = useState(cgAssetsPg);

  const rowCount = ROW_COUNT;

  const [pageIndex, setPageIndex] = useState(cgAssetsPg.currentPage - 1);
  const [pageCount, setPageCount] = useState(Math.ceil(cgAssetsPg.total / rowCount));
  const [order, setOrder] = useState('');
  const [orderAsc, setOrderAsc] = useState(true);
  const [searchTxt, setSearchTxt] = useState('');

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [deleteCgAssetId, setDeleteCgAssetId] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    setLoading(false)
  }, [])

  const onDelete = async () => {
    try {
      setLoading(true);

      const ret: FetchResult<DeleteCgAssetMutation>
        = await apolloClient
          .mutate({
            mutation: DeleteCgAssetDocument,
            variables: {
              id: deleteCgAssetId,
            },
          })

      // console.log("ret", ret);
      if (
        ret.errors &&
        ret.errors[0] &&
        ret.errors[0].extensions &&
        ret.errors[0].extensions.debugMessage
      ) {
        throw new Error(ret.errors[0].extensions.debugMessage as string)
      } else if (
        ret.errors &&
        ret.errors[0]
      ) {
        throw new Error(ret.errors[0].message as string)
      }

      router.refresh();
      // router.push(`/`);
      refreshPage();
      toast.success('CGアセットが削除されました。');
    } catch (error: any) {
      console.log(`err: ${error}`);
      toast.error('CGアセットの削除に失敗しました。');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  const fetchData = async (param) => {
    setLoading(true)

    const ret: ApolloQueryResult<GetCgAssetsCreatedAllQuery>
      = await apolloClient
        .query({
          query: GetCgAssetsCreatedAllDocument,
          variables: {
            create_user_id: (session?.user as { userId: string }).userId,
            first: rowCount,
            section: cgAssetsSearchSection,
            page: param.page, // pageIndex + 1,
            order: param.order, // order,
            orderAsc: (param.orderAsc ? 'ASC' : 'DESC'), // (orderAsc ? 'ASC' : 'DESC'),
            searchTxt: param.searchTxt, // searchTxt
          }
        });
    setItems(() => ret.data.CGAssetsCreatedAll.data as CgAsset[]);
    setPgInfo(() => ret.data.CGAssetsCreatedAll.paginatorInfo as PaginatorInfo);
    setPageCount(() => Math.ceil(ret.data.CGAssetsCreatedAll.paginatorInfo.total / rowCount));

    setLoading(false)
  }

  const refreshPage = async () => {
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
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        title={deleteConfirmText}
      />
      <Table>
        <TableCaption>登録一覧</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead onClick={(e) => handleSort('created_at')} className="w-[100px]">Date</TableHead>
            <TableHead onClick={(e) => handleSort('asset_id')}>Asset ID</TableHead>
            <TableHead onClick={(e) => handleSort('asset_name')}>Asset Name</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items && items.map((elem: CgAsset | null) => {

            if (elem) {

              return <TableRow key={elem.id}>
                <TableCell className="">{format(new Date(elem.created_at), "yyyy/MM/dd")}</TableCell>
                <TableCell>{elem.asset_id}</TableCell>
                <TableCell>{elem.asset_name}</TableCell>
                <TableCell className="flex items-center justify-between">
                  <Button
                    variant="default"
                    disabled={loading}
                    className="ml-auto"
                    type="button"
                    onClick={() => router.push(`/c_g_assets/${elem.id}/edit`)}
                  >
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={loading}
                    className="ml-auto"
                    type="button"
                    onClick={() => {
                      setDeleteCgAssetId(() => elem.id);
                      setDeleteConfirmText(() => `以下のアセット情報削除を実行してよろしいですか？<br ><br >Asset ID: ${elem.asset_id}<br >Asset Name: ${elem.asset_name}`);
                      setOpen(true);
                    }}
                  >
                    削除
                  </Button>
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
AssetRegisterdList.displayName = "AssetRegisterdList";

export default AssetRegisterdList