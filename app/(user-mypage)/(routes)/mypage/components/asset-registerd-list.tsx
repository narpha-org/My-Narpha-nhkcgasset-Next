"use client";

import { Ref, forwardRef, useEffect, useState, useImperativeHandle, useCallback } from "react"
import Image from 'next/image'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"
// import ReactPaginate from 'react-paginate';
import { format } from 'date-fns'

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import { Button } from "@/components/ui/button-raw";
// import { Loader } from "@/components/ui/loader";
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
import { MyPagenator } from "@/components/ui/pagenator";
import { ROW_COUNT } from "@/lib/pagenation";
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  // TableHeader,
  TableRow,
} from "@/components/ui/table-raw"

interface AssetRegisterdListProps {
  searchRef: Ref<{ handleSearch(txt: string): void; } | undefined>
  cgAssets?: CgAsset[]
  cgAssetsPg?: CgAssetPaginator['paginatorInfo']
  cgAssetsSearchSection: string
}

const AssetRegisterdList: React.FC<AssetRegisterdListProps> = forwardRef(({
  cgAssets,
  cgAssetsPg,
  cgAssetsSearchSection,
}, searchRef) => {
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(cgAssets);
  const [pgInfo, setPgInfo] = useState(cgAssetsPg);

  const rowCount = ROW_COUNT;

  const [pageIndex, setPageIndex] = useState(cgAssetsPg!.currentPage - 1);
  const [pageCount, setPageCount] = useState(Math.ceil(cgAssetsPg!.total / rowCount));
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

  const fetchData = useCallback(async (param) => {
    if (!session?.user) {
      return;
    }

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
  }, [rowCount, session?.user, cgAssetsSearchSection]);

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
      // router.push(`/mypage`);
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
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        title={deleteConfirmText}
      />
      <Table className="mypage__mainlist">
        <TableBody>
          <TableRow className="top">
            <TableHead className="sortable" onClick={(e) => handleSort('c_g_assets.created_at')}>Date</TableHead>
            <TableHead className="sortable" onClick={(e) => handleSort('asset_id')}>Asset ID</TableHead>
            <TableHead className="sortable" onClick={(e) => handleSort('asset_name')}>Asset Name</TableHead>
            <TableHead className="sortable" onClick={(e) => handleSort('users_create.name')}>登録者</TableHead>
            <TableHead></TableHead>
          </TableRow>
          {items && items.map((elem: CgAsset | null) => {

            if (elem) {

              return <TableRow key={elem.id}>
                <TableCell className="">{format(new Date(elem.created_at), "yyyy年MM月dd日")}</TableCell>
                <TableCell>{elem.asset_id}</TableCell>
                <TableCell>{elem.asset_name}</TableCell>
                <TableCell>{elem.userCreate.name}</TableCell>
                <TableCell className="flex items-center justify-between">
                  <Button
                    disabled={loading}
                    className="tag_gray"
                    type="button"
                    onClick={() => router.push(`/c_g_assets/${elem.id}/edit`)}
                  >
                    編集
                  </Button>
                  <Button
                    disabled={loading}
                    className="tag_gray"
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
AssetRegisterdList.displayName = "AssetRegisterdList";

export default AssetRegisterdList