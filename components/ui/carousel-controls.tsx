// components/CarouselControls.tsx
import classNames from "classnames";
import { Button } from "./button";

type Props = {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  onPrev(): void;
  onNext(): void;
};
const CarouselControls = (props: Props) => {
  return (
    <div className="flex justify-end gap-2 ">
      <Button
        onClick={() => {
          if (props.canScrollPrev) {
            props.onPrev();
          }
        }}
        disabled={!props.canScrollPrev}
        className={classNames({
          "px-4 py-2 text-white rounded-md": true,
          "bg-indigo-200": !props.canScrollPrev,
          "bg-indigo-400": props.canScrollPrev,
        })}
      >
        前のイメージ
      </Button>
      <Button
        onClick={() => {
          if (props.canScrollNext) {
            props.onNext();
          }
        }}
        disabled={!props.canScrollNext}
        className={classNames({
          "px-4 py-2 text-white rounded-md": true,
          "bg-indigo-200": !props.canScrollNext,
          "bg-indigo-400": props.canScrollNext,
        })}
      >
        次のイメージ
      </Button>
    </div>
  );
};
export default CarouselControls;
