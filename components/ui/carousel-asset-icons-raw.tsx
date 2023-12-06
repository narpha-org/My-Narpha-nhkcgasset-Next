import Image from 'next/image';
import classNames from "classnames";
import {
  CgAssetThumb,
  // CgAsset3Dcg,
  // CgAssetImage,
  // CgAssetVideo,
} from "@/graphql/generated/graphql";
import { MouseEventHandler } from 'react';

type Props = {
  medias: CgAssetThumb[] | null;
  selectedIndex: number;
  onMove(idx: number): void;
};
const CarouselAssetIcons = ({ medias, selectedIndex, onMove }: Props) => {
  return (
    <ul>
      {medias?.map((media, index) => {
        const selected = index === selectedIndex;
        return (
          <li
            key={index}
          >
            <a href="#"
              className={classNames({
                "":
                  true,
                "active": selected,
              })}
              onClick={(event) => onMove(index)}
            >
              <Image
                src={media.thumb_url as string}
                alt="サムネイル" // {media.id}
                decoding="async"
                width={0}
                height={0}
                sizes="100%"
                style={{ width: '4.5833333333vw', height: '2.6041666667vw' }}
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
};
export default CarouselAssetIcons;
