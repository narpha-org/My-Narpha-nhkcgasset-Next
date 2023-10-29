import Image from 'next/image';
import classNames from "classnames";
import {
  CgAsset3Dcg,
  CgAssetImage,
  CgAssetVideo,
} from "@/graphql/generated/graphql";
import { MouseEventHandler } from 'react';

type Props = {
  medias: CgAssetImage[] | CgAssetVideo[] | CgAsset3Dcg[] | null;
  selectedIndex: number;
  onMove(idx: number): void;
};
const CarouselAssetIcons = ({ medias, selectedIndex, onMove }: Props) => {
  return (
    <div
      className="flex gap-1 my-2 justify-center -translate-y-5"
      style={{
        zIndex: 100,
        width: "100%",
        height: "27px",
        position: "absolute",
        top: "417px"
      }}>
      {medias?.map((media, index) => {
        const selected = index === selectedIndex;
        return (
          <div
            className={classNames({
              "h-27 w-50 transition-all duration-300 bg-slate-400":
                true,
              // tune down the opacity if slide is not selected
              "opacity-50": !selected,
            })}
            style={{
              height: "27px",
              width: "50px",
              cursor: "pointer"
            }}
            key={index}
            onClick={(event) => onMove(index)}
          >
            <Image src={media.thumb_url} width={50} height={27} className="object-cover" alt={media.id}
              style={{
                position: "relative",
                height: "27px",
                width: "50px"
              }} />
          </div>
        );
      })}
    </div >
  );
};
export default CarouselAssetIcons;
