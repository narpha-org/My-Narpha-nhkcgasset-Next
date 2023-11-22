import Image from 'next/image';

import CarouselAsset from "@/components/ui/carousel-asset-raw";
import {
  CgAsset,
} from "@/graphql/generated/graphql";

import { getAssetMedias } from "./asset-media";

interface AssetsCarouselBlockProps {
  cgAsset: CgAsset;
}

const AssetsCarouselBlock: React.FC<AssetsCarouselBlockProps> = ({
  cgAsset
}) => {

  const getMediaImage = (cgAsset: CgAsset) => {

    const { mediaDesc, medias, notFound } = getAssetMedias(cgAsset);

    if (!medias || !medias.length) {
      return <>
        <Image
          src={notFound}
          alt={cgAsset.asset_id}
          width={0}
          height={0}
          sizes="100%"
          style={{ width: '100%', height: 'auto' }}
        />
      </>
    }

    return <>
      <div className="detail__mainimg">
        <CarouselAsset loop medias={medias}>
          {medias && medias.map((obj, i) => {
            return (
              <Image
                key={i}
                src={obj.thumb_url as string}
                alt={cgAsset.asset_id}
                width={0}
                height={0}
                sizes="100%"
                style={{
                  width: '52.7083333333vw',
                  minWidth: '52.7083333333vw',
                  maxWidth: '52.7083333333vw',
                  height: 'auto'
                }}
              />
            );
          })}
        </CarouselAsset>
      </div>
    </>
  }

  return (
    <>
      <div className="detail__mainimg">
        {getMediaImage(cgAsset)}
      </div>
    </>
  )
}

export default AssetsCarouselBlock