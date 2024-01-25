"use client";

import { useEffect, useState, useRef, ChangeEventHandler, ComponentProps } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';

import { uploadImageToS3 } from '@/lib/aws-s3';
import { uploadImageToS3Glacier } from '@/lib/aws-s3-glacier';
import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button-raw';
// import { ImagePlus, Trash } from 'lucide-react';

/**
 * 配列の要素を移動させる
 */
function moveItem<T = any>(
  arr: T[],
  currentIndex: number,
  targetIndex: number
) {
  const targetItem = arr[currentIndex];
  let resArr = arr.map((target, i) => (i === currentIndex ? null : target));
  resArr.splice(targetIndex, 0, targetItem);
  return resArr.flatMap((target) => (target !== null ? [target] : []));
}

export type Item = {
  thumb_file_name: string;
  thumb_url: string;
  thumb_file_path: string;
  order: number;
  id: string;
};

// type Props = {
//   value: Item[];
//   onChange?: (newItems: Item[]) => void;
// };

export type UploadImageProps = {
  thumb_file_name: string;
  thumb_url: string;
  thumb_file_path: string;
  order: number;
  id: string;
}

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (items: UploadImageProps[]) => void;
  onRemove: (value: string) => void;
  value: UploadImageProps[];
  glacier?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  glacier
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef(null);

  const [items, setItems] = useState([...value]);
  const $refs = useRef<Map<string, HTMLElement>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [targetIndex, setTargetIndex] = useState(-1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setItems([...value]);
  }, [value]);

  const handleClick = () => {
    // 👇️ open file input box on click of another element
    (inputRef.current as unknown as HTMLInputElement).click();
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async event => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }

    console.log('fileObj is', fileObj);

    // 👇️ reset file input
    event.target.value = "";

    // 👇️ is now empty
    console.log(event.target.files);

    // 👇️ can still access file object here
    console.log(fileObj);
    console.log(fileObj.name);

    let fileData: CompleteMultipartUploadCommandOutput | null = null;

    fileData = await uploadImageToS3(fileObj);

    console.log(fileData?.Bucket);
    console.log(fileData?.Key);
    console.log(fileData?.Location);

    let fileDataGlacier: CompleteMultipartUploadCommandOutput | null = null;

    if (glacier) {
      fileDataGlacier = await uploadImageToS3Glacier(fileObj);

      console.log(fileDataGlacier?.Bucket);
      console.log(fileDataGlacier?.Key);
      console.log(fileDataGlacier?.Location);
    }

    if (glacier && fileData && fileDataGlacier) {
      setItems([...items, {
        thumb_file_name: fileObj.name,
        thumb_url: fileData?.Location as string,
        thumb_file_path: fileData?.Key as string,
        order: value.length + 1,
        id: "new" + Date.now(),
      }]);
      onChange(items);
    } else if (fileData) {
      setItems([...items, {
        thumb_file_name: fileObj.name,
        thumb_url: fileData?.Location as string,
        thumb_file_path: fileData?.Key as string,
        order: value.length + 1,
        id: "new" + Date.now(),
      }]);
      onChange(items);
    }
  };

  if (!isMounted) {
    return null;
  }

  /**
   * refを受け取ってMapに格納する
   */
  const setElm = (id: string, elm: HTMLElement | null) => {
    if (elm) {
      $refs.current.set(id, elm);
    } else {
      $refs.current.delete(id);
    }
  };

  /**
   * ドラッグを開始する要素に設定するpropsを生成する
   */
  const getHandleProps = (
    item: Item,
    index: number
  ): ComponentProps<"li"> => {
    return {
      onDragStart(event) {
        // activeIdを設定
        setActiveId(item.id);

        // ドラッグしているデータと許容する動作を設定
        event.dataTransfer.setData("text/plain", item.id);
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";

        // ドラッグ時に表示される画像(要素)を設定
        const elm = $refs.current.get(item.id);
        if (elm) {
          const rect = elm.getBoundingClientRect();
          const posX = event.clientX - rect.left;
          const posY = event.clientY - rect.top;
          event.dataTransfer.setDragImage(elm, posX, posY);
        }
      },
      onDragEnd(event) {
        // activeIdから移動中のアイテムのindexを取得
        const currentIndex = items.findIndex(
          (target) => target.id === activeId
        );

        // indexが有効範囲であれば移動を実行
        if (currentIndex >= 0 && targetIndex >= 0) {
          const newItems = moveItem(items, currentIndex, targetIndex);
          setItems(newItems);
          onChange(newItems);
        }

        // stateを初期化
        setActiveId(null);
        setTargetIndex(-1);
      }
    };
  };

  /**
   * ドラッグ先の要素に設定するpropsを生成する
   */
  const getItemProps = (item: Item, index: number): ComponentProps<"li"> => {
    return {
      draggable: true,
      ref(elm) {
        setElm(item.id, elm);
      },
      onDragOver(event) {
        event.preventDefault();
        const elm = $refs.current.get(item.id);
        if (!elm) return;
        // カーソルが当たっている要素の相対位置情報を取得
        const rect = elm.getBoundingClientRect();
        // 要素内でのカーソル位置
        const posY = event.clientY - rect.top;
        // 要素の縦幅に対しての割合(念のため0-1に丸めておく)
        const ratioY = Math.min(1, Math.max(0, posY / rect.height));
        // 移動先のindexを更新
        setTargetIndex(index + Math.round(ratioY));
      },
      // 初期のイベントはキャンセルしておく(制御されていないEventの発生を無くすため)
      onDragEnter(event) {
        event.preventDefault();
      },
      onDragLeave(event) {
        event.preventDefault();
      },
      onDrop(event) {
        event.preventDefault();
      }
    };
  };

  return (
    <>
      <h2>サムネイル<button
        className={cn(
          'select',
          disabled && 'opacity-50'
        )}
        type="button"
        disabled={disabled}
        onClick={handleClick}
      >
        <input
          accept="image/*"
          id="upload-button"
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          hidden
        />
        ファイルから選択
      </button></h2>
      <ul>
        {items.map((obj, idx) => (
          <li
            key={idx}
            className=""
            data-objId={obj.id}
            data-objOrder={obj.order}
            {...getHandleProps(obj, idx)}
            {...getItemProps(obj, idx)}
          >
            <Link
              href={obj.thumb_url}
              rel="noopener noreferrer"
              target="_blank"
              className="my-assets-thumbnail-link"
            >
              <Image
                src={obj.thumb_url}
                width={80}
                height={80}
                // style={{ objectFit: 'cover' }}
                alt="Image"
              />
            </Link>
            <Image
              src="/assets/images/file_close.svg"
              className={cn(
                'file_close',
                disabled && 'opacity-50'
              )}
              width={16.5}
              height={16.5}
              alt=""
              onClick={() => { if (!disabled) onRemove(obj.thumb_url) }}
              style={disabled ? { cursor: 'default' } : { cursor: 'pointer' }}
            />
          </li>
        ))}
        {value.length < 12 && [...Array(12 - value.length)].map((_, i) => (
          <li key={`blank_${i}`}><Image src="/assets/images/file_tumb.webp" width="80" height="80" alt="" />
            <Image src="/assets/images/file_close.svg" className="file_close" width={16.5} height={16.5} alt="" />
          </li>
        ))
        }
      </ul>
    </>
  );
}

export default ImageUpload;
