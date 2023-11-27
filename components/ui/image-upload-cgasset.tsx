"use client";

import { useEffect, useState, useRef, ChangeEventHandler } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ManagedUpload } from 'aws-sdk/clients/s3';

import { uploadImageToS3 } from '@/lib/aws-s3';
import { uploadImageToS3Glacier } from '@/lib/aws-s3-glacier';
import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button-raw';
// import { ImagePlus, Trash } from 'lucide-react';

export type UploadImageProps = {
  thumb_file_name: string;
  thumb_url: string;
  thumb_file_path: string;
}

interface ImageUploadProps {
  disabled?: boolean;
  onChange: ({ thumb_file_name, thumb_url, thumb_file_path }: UploadImageProps) => void;
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

    let fileData: ManagedUpload.SendData | null = null;

    fileData = await uploadImageToS3(fileObj);

    console.log(fileData?.Bucket);
    console.log(fileData?.Key);
    console.log(fileData?.Location);

    let fileDataGlacier: ManagedUpload.SendData | null = null;

    if (glacier) {
      fileDataGlacier = await uploadImageToS3Glacier(fileObj);

      console.log(fileDataGlacier?.Bucket);
      console.log(fileDataGlacier?.Key);
      console.log(fileDataGlacier?.Location);
    }

    if (glacier && fileData && fileDataGlacier) {
      onChange({
        thumb_file_name: fileObj.name,
        thumb_url: fileData?.Location,
        thumb_file_path: fileData?.Key,
      });
    } else if (fileData) {
      onChange({
        thumb_file_name: fileObj.name,
        thumb_url: fileData?.Location,
        thumb_file_path: fileData?.Key,
      });
    }
  };

  if (!isMounted) {
    return null;
  }

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
        {value.map((obj, idx) => (
          <li key={idx} className="">
            <Link href={obj.thumb_url} rel="noopener noreferrer" target="_blank" className="my-assets-thumbnail-link">
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
