"use client";

import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { uploadImageToS3 } from '@/lib/aws-s3';
import { uploadImageToS3Glacier } from '@/lib/aws-s3-glacier';
import { useEffect, useState, useRef, ChangeEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImagePlus, Trash } from 'lucide-react';
import Link from 'next/link';

export type UploadImageProps = {
  file_name: string;
  url: string;
  file_path: string;
  thumb_file_name: string;
  thumb_url: string;
  thumb_file_path: string;
}

export type UploadThumbProps = {
  thumb_file_name: string;
  thumb_url: string;
  thumb_file_path: string;
}

interface ImageUploadProps {
  disabled?: boolean;
  onChange: ({ file_name, url, file_path, thumb_file_name, thumb_url, thumb_file_path }: UploadImageProps) => void;
  onRemove: (value: string) => void;
  value: UploadImageProps[];
  glacier?: boolean;
}

interface ThumbUploadProps {
  disabled?: boolean;
  onChange: ({ thumb_file_name, thumb_url, thumb_file_path }: UploadThumbProps) => void;
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
      onChange({
        file_name: fileObj.name,
        url: fileDataGlacier?.Location as string,
        file_path: fileDataGlacier?.Key as string,
        thumb_file_name: fileObj.name,
        thumb_url: fileData?.Location as string,
        thumb_file_path: fileData?.Key as string,
      });
    } else if (fileData) {
      onChange({
        file_name: fileObj.name,
        url: fileData?.Location as string,
        file_path: fileData?.Key as string,
        thumb_file_name: fileObj.name,
        thumb_url: fileData?.Location as string,
        thumb_file_path: fileData?.Key as string,
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        {value.map((obj, idx) => (
          <div key={idx} className="relative w-[290px] h-[160px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(obj.url)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Link href={obj.url} rel="noopener noreferrer" target="_blank">
              <Image
                fill
                className="object-cover"
                alt="Image"
                src={obj.thumb_url ? obj.thumb_url : obj.url}
              />
            </Link>
          </div>
        ))}
      </div>
      <Button
        type="button"
        disabled={disabled}
        variant="secondary"
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
        <ImagePlus className="h-4 w-4 mr-2" />
        アップロード
      </Button>
    </>
  );
}

export default ImageUpload;
