import Image from 'next/image';

import Carousel from "@/components/ui/carousel";
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

    if (!medias) {
      return <>
        <Image
          src={notFound}
          alt={cgAsset.asset_id}
          width={500}
          height={276}
        />
      </>
    }

    return <>
      <div className="lg:w-3/4 mx-auto my-2">
        <Carousel loop>
          {medias && medias.map((obj, i) => {
            return (
              // 👇 style each individual slide.
              // relative - needed since we use the fill prop from next/image component
              // h-64 - arbitrary height
              // flex[0_0_100%]
              //   - shorthand for flex-grow:0; flex-shrink:0; flex-basis:100%
              //   - we want this slide to not be able to grow or shrink and take up 100% width of the viewport.
              <div className="relative h-96 flex-[0_0_100%]" key={i}>
                {/* use object-cover + fill since we don't know the height and width of the parent */}
                <Image src={obj.thumb_url} fill className="object-cover" alt={cgAsset.asset_id} />
              </div>
            );
          })}
        </Carousel>
      </div>
    </>
  }

  return (
    <>
      <div className="h-16 items-center px-4">
        {getMediaImage(cgAsset)}
      </div>
    </>
  )
}

export default AssetsCarouselBlock