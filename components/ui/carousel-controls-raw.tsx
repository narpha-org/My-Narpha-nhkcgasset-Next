// components/CarouselControls.tsx
import classNames from "classnames";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from 'next/image'

type Props = {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  onPrev(): void;
  onNext(): void;
};
const CarouselControls = (props: Props) => {
  return (
    <>
      <a href="#" className="detail__prev"
        onClick={() => {
          if (props.canScrollPrev) {
            props.onPrev();
          }
        }}
      // disabled={!props.canScrollPrev}
      >
        <Image src="/assets/images/detail-arrow-l.svg" alt="前のスライダーへ" width="16" height="45"
          decoding="async" />
      </a>
      <a href="#" className="detail__next"
        onClick={() => {
          if (props.canScrollNext) {
            props.onNext();
          }
        }}
      // disabled={!props.canScrollNext}
      >
        <Image src="/assets/images/detail-arrow-r.svg" alt="次のスライダーへ" width="16" height="45"
          decoding="async" />
      </a>
    </>
  );
};
export default CarouselControls;
