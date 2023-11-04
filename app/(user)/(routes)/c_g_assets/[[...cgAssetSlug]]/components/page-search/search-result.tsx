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
                  <div style={{ width: "500", height: "276", position: "relative" }}>
                    <Image
                      src={(medias && medias[0] ? medias[0].thumb_url as string : notFound)}
                      alt={elem.asset_id}
                      width={500}
                      height={276}
                    />
                    <p style={{ position: "absolute", top: "9.3rem", left: "0.6rem", zIndex: 40, color: "white", textShadow: "1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000", height: "2.0rem" }}>{elem.asset_name}</p>
                    <p style={{ position: "absolute", top: "0.4rem", left: "0.6rem", width: "19.0rem", textAlign: "right", zIndex: 40, color: "white", textShadow: "1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000", height: "2.0rem" }}>{mediaDesc}</p>
                    <p style={{ position: "absolute", top: "9.3rem", left: "0.6rem", width: "19.0rem", textAlign: "right", zIndex: 40, color: "white", textShadow: "1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000", height: "2.0rem" }}>DL数:{elem.download_count}</p>
                  </div>
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