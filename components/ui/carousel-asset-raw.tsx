"use client";

// components/Carousel.tsx
// import the hook and options type
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import React from "react";
import { PropsWithChildren, useEffect, useState } from "react";
import CarouselControls from "@/components/ui/carousel-controls-raw";
// import CarouselDots from "@/components/ui/carousel-dots";
import CarouselAssetIcons from "@/components/ui/carousel-asset-icons-raw";
import {
  CgAssetThumb,
  // CgAsset3Dcg,
  // CgAssetImage,
  // CgAssetVideo,
} from "@/graphql/generated/graphql";

type Props = PropsWithChildren & EmblaOptionsType & {
  medias: CgAssetThumb[] | null;
};

const CarouselAsset = ({ children, ...options }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  // need to selectedIndex to allow this component to re-render in react.
  // Since emblaRef is a ref, it won't re-render even if there are internal changes to its state.
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    function selectHandler() {
      const index = emblaApi?.selectedScrollSnap();
      setSelectedIndex(index || 0);
    }

    emblaApi?.on("select", selectHandler);
    // cleanup
    return () => {
      emblaApi?.off("select", selectHandler);
    };
  }, [emblaApi]);

  // const length = React.Children.count(children);
  const canScrollNext = !!emblaApi?.canScrollNext();
  const canScrollPrev = !!emblaApi?.canScrollPrev();
  return (
    <>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">{children}</div>
      </div>
      <div className="detail__listbox">
        <CarouselAssetIcons
          medias={options.medias}
          selectedIndex={selectedIndex}
          onMove={(idx) => emblaApi?.scrollTo(idx)}
        />
        <CarouselControls
          canScrollNext={canScrollNext}
          canScrollPrev={canScrollPrev}
          onNext={() => emblaApi?.scrollNext()}
          onPrev={() => emblaApi?.scrollPrev()}
        />
      </div>
    </>
  );
};
export default CarouselAsset;
