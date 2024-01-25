"use client";

import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  cloneElement
} from "react";
import { moveItem } from "./utils";

export type Item<T = any> = {
  id: string;
  data: T;
};

type HandleProps = {
  draggable: true;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
};

type ItemProps = {
  key: string;
  ref: (elm: HTMLElement | null) => void;
  onDragEnter?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDragLeave?: (event: React.DragEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
};

type ItemViewParams<T = any> = {
  item: Item<T>;
  index: () => number;
  handleProps: HandleProps;
  itemProps: ItemProps;
};

type GhostViewParams<T = any> = {
  item: Item<T>;
  ghostProps: Omit<ItemProps, "ref">;
};

type Props<T = any> = {
  initItems: Item<T>[];
  direction?: "vertical" | "horizontal";
  onChange?: (newItems: Item<T>[]) => void;
  // ReactNodeではなくメソッドを受け取る
  // 必須にすることで何が必要か一目でわかる
  children: (params: ItemViewParams<T>) => JSX.Element;
  ghost?: (params: GhostViewParams<T>) => JSX.Element;
};

export function Draggable<T = any>({
  initItems,
  direction = "vertical",
  onChange = () => { },
  children: itemView,
  ghost: ghostView = () => <></>
}: Props<T>) {
  const [items, setItems] = useState(initItems);
  const $refs = useRef(new Map<string, HTMLElement>());
  const [activeId, setActiveId] = useState<null | string>(null);
  const $activeId = useRef<typeof activeId>(null);
  const [targetIndex, setTargetIndex] = useState(-1);
  const $targetIndex = useRef(-1);

  useEffect(() => {
    setItems(initItems);
  }, [initItems]);

  const setElm = (itemId: string, elm: HTMLElement | null) => {
    if (elm) {
      $refs.current.set(itemId, elm);
    } else {
      $refs.current.delete(itemId);
    }
  };

  const getIndex = useCallback(
    (itemId: string | null) => {
      return items.findIndex((item) => item.id === itemId);
    },
    [items]
  );

  /**
   * リストアイテムのドラッグ開始用Propsを生成
   */
  const getHandleProps = (item: Item<T>): HandleProps => {
    return {
      draggable: true,
      onDragStart(event) {
        // activeIdの更新
        setActiveId(item.id);
        $activeId.current = item.id;

        // ドラッグデータの設定
        event.dataTransfer.setData("text/plain", item.id);
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";

        // HTMLElementが存在すればドラッグ画像を設定
        const elm = $refs.current.get(item.id);
        if (elm) {
          const rect = elm.getBoundingClientRect();
          const posX = event.clientX - rect.left;
          const posY = event.clientY - rect.top;
          event.dataTransfer.setDragImage(elm, posX, posY);
        }
      },
      onDragEnd(event) {
        if ($activeId.current === item.id) {
          const activeIndex = getIndex(item.id);
          if (activeIndex >= 0 && $targetIndex.current >= 0) {
            const newItems = moveItem(items, activeIndex, $targetIndex.current);
            setItems(newItems);
            onChange(newItems);
          }
        }
        // activeIdを初期化
        setActiveId(null);
        $activeId.current = null;
        // targetIndexを初期化
        setTargetIndex(-1);
        $targetIndex.current = -1;
      }
    };
  };

  /**
   * リストアイテム用Propsを生成
   */
  const getItemProps = (item: Item<T>): ItemProps => {
    return {
      key: item.id,
      ref: (elm) => setElm(item.id, elm),
      onDragEnter(event) {
        event.preventDefault();
      },
      onDragLeave(event) {
        event.preventDefault();
      },
      onDrop(event) {
        event.preventDefault();
      },
      onDragOver(event) {
        event.preventDefault();
        const elm = $refs.current.get(item.id);
        const i = getIndex(item.id);
        // HTMLElementの存在確認
        if (!elm || i < 0) return;

        // カーソル位置に応じてtargetIndexを更新する
        const rect = elm.getBoundingClientRect();
        const posX = event.clientX - rect.left;
        const posY = event.clientY - rect.top;
        const ratioX = Math.min(1, Math.max(0, posX / rect.width));
        const ratioY = Math.min(1, Math.max(0, posY / rect.height));
        const shift = Math.round(direction === "vertical" ? ratioY : ratioX);
        setTargetIndex(i + shift);
        $targetIndex.current = i + shift;
      }
    };
  };

  /**
   * ゴースト用Propsを生成
   */
  const getGhostProps = (): GhostViewParams["ghostProps"] => {
    return {
      key: "__ghost__",
      onDragEnter(event) {
        event.preventDefault();
      },
      onDragLeave(event) {
        event.preventDefault();
      },
      onDrop(event) {
        event.preventDefault();
      },
      onDragOver(event) {
        event.preventDefault();
      }
    };
  };

  /**
   * JSX.Elementをメモ化して再レンダリングと計算を抑える
   */
  const views = useMemo(() => {
    return items.map((item) => {
      return itemView({
        item,
        index: () => items.findIndex((target) => target.id === item.id),
        handleProps: getHandleProps(item),
        itemProps: getItemProps(item)
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, itemView]);

  /**
   * JSX.Elementの再生成を抑えて再レンダリングと計算を抑える目的
   * 生成済みのviews(JSX.Element[])にゴーストやその他の情報を付与する
   */
  const viewsWithGhost = useMemo(() => {
    const activeIndex = getIndex(activeId);
    return views.flatMap((view, i) => {
      if (i === activeIndex) {
        // activeIndexだったらクローンを作成して属性値を付与
        const viewWithAttr = cloneElement(view, {
          "data-active": true
        });
        return [viewWithAttr];
      }

      if (i === targetIndex) {
        // targetIndexだったらクローンを作成して属性値を付与
        const viewWithAttr = cloneElement(view, {
          "data-target": true
        });

        if (i - activeIndex >= 2 || i - activeIndex < 0) {
          // 移動可能な位置ならゴーストと一緒に返す
          const ghost = ghostView({
            item: items[activeIndex],
            ghostProps: getGhostProps()
          });
          return [ghost, viewWithAttr];
        }
        return [viewWithAttr];
      }

      if (i + 1 === items.length && i + 1 === targetIndex) {
        // targetIndexが末尾ならゴーストと一緒に返す
        const ghost = ghostView({
          item: items[activeIndex],
          ghostProps: getGhostProps()
        });
        return [view, ghost];
      }

      // 通常アイテムならそのままviewを返す
      return [view];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views, ghostView, activeId, targetIndex]);

  return <>{viewsWithGhost}</>;
}
