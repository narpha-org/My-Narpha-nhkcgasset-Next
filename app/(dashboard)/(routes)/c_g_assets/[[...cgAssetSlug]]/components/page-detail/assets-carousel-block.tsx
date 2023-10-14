import Image from 'next/image';

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

    return <>
      <Image
        src={(medias && medias[0] ? medias[0].thumb_url as string : notFound)}
        alt={cgAsset.asset_id}
        width={500}
        height={276}
      />
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