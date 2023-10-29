// components/CarouselControls.tsx
import classNames from "classnames";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  onPrev(): void;
  onNext(): void;
};
const CarouselControls = (props: Props) => {
  return (
    <>
      <div className="absolute h-full top-0 left-0">
        <Button
          variant="ghost"
          onClick={() => {
            if (props.canScrollPrev) {
              props.onPrev();
            }
          }}
          disabled={!props.canScrollPrev}
          className={classNames({
            "text-white-400/25 rounded-md h-full hover:bg-transparent hover:text-white-400/100": true,
            "opacity-0 disabled:opacity-0": !props.canScrollPrev,
            "bg-transparent": props.canScrollPrev,
          })}
        >
          <ChevronLeft className="h-8 w-8 text-white-400/25 hover:text-white-400/100" />
        </Button>
      </div>
      <div className="absolute h-full top-0 right-0">
        <Button
          variant="ghost"
          onClick={() => {
            if (props.canScrollNext) {
              props.onNext();
            }
          }}
          disabled={!props.canScrollNext}
          className={classNames({
            "text-white-400/25 rounded-md h-full hover:bg-transparent hover:text-white-400/100": true,
            "opacity-0 disabled:opacity-0": !props.canScrollNext,
            "bg-transparent": props.canScrollNext,
          })}
        >
          <ChevronRight className="h-8 w-8 text-white-400/25 hover:text-white-400/100" />
        </Button>
      </div>
    </>
  );
};
export default CarouselControls;
