import Link from "next/link"
import Image from 'next/image';

import { CgAsset, PaginatorInfo } from '@/graphql/generated/graphql';

import { getAssetMedias } from "../page-detail/asset-media";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";

interface SearchResultProps {
  data: CgAsset[];
  paginatorInfo: PaginatorInfo | null;
  loading: boolean;
  isInitPage: boolean;
  onLoadMorePage: () => Promise<void>;
}

const SearchResult: React.FC<SearchResultProps> = ({
  data,
  paginatorInfo,
  loading,
  isInitPage,
  onLoadMorePage
}) => {
  return (
    <>
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

            const { mediaDesc, medias, notFound } = getAssetMedias(elem);

            return <div key={elem.id}>
              <Link key={elem.id} href={`/c_g_assets/${elem.id}`}>
                {medias ? (
                  <>
                    <Image
                      src={(medias && medias[0] ? medias[0].thumb_url as string : notFound)}
                      alt={elem.asset_id}
                      width={500}
                      height={276}
                    />
                    <p style={{ marginTop: "-1.9rem", marginLeft: "0.6rem", zIndex: 100, color: "white" }}>{elem.asset_name}</p>
                    <p style={{ marginTop: "-1.5rem", marginLeft: "18.1rem", zIndex: 100, color: "white", height: "2.0rem" }}>{mediaDesc}</p>
                  </>
                ) : elem.asset_id}
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
    </>
  )
}

export default SearchResult