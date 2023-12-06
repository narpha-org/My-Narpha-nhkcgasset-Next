import ReactPaginate from 'react-paginate';
import Image from 'next/image'
import { Button } from "@/components/ui/button-raw";

interface MyPagenatorProps {
  pageIndex: number;
  pageCount: number;
  handlePageClick: (data: any) => Promise<void>;
  targetPage: (data: any) => Promise<void>;
  getCanPreviousPage: () => boolean;
  getCanNextPage: () => boolean;
  className: string;
}

export const MyPagenator: React.FC<MyPagenatorProps> = ({
  pageIndex,
  pageCount,
  handlePageClick,
  targetPage,
  getCanPreviousPage,
  getCanNextPage,
  className = "mypage__pagenation",
}) => {

  return (
    <div className={className}>
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
      {pageCount > 0 && (
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
      )}
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
    </div>
  )
}
