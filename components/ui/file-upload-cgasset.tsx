"use client";

import { ManagedUpload } from 'aws-sdk/clients/s3';
import { uploadImageToS3 } from '@/lib/aws-s3';
import { uploadImageToS3Glacier } from '@/lib/aws-s3-glacier';
import { useEffect, useState, useRef, ChangeEventHandler } from 'react';

import { Button } from '@/components/ui/button-raw';
import Image from 'next/image';
import { FileVideo, Trash } from 'lucide-react';
import Link from 'next/link';

export type UploadFileProps = {
  file_name: string;
  url: string;
  file_path: string;
}

interface FileUploadProps {
  disabled?: boolean;
  onChange: ({ file_name, url, file_path }: UploadFileProps) => void;
  onRemove: (value: string) => void;
  value: UploadFileProps[];
  poster: string;
  glacier?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  poster,
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
    let fileDataGlacier: ManagedUpload.SendData | null = null;

    if (glacier) {
      fileDataGlacier = await uploadImageToS3Glacier(fileObj);

      console.log(fileDataGlacier?.Bucket);
      console.log(fileDataGlacier?.Key);
      console.log(fileDataGlacier?.Location);
    } else {
      fileData = await uploadImageToS3(fileObj);

      console.log(fileData?.Bucket);
      console.log(fileData?.Key);
      console.log(fileData?.Location);
    }

    if (glacier && fileData && fileDataGlacier) {
      onChange({
        file_name: fileObj.name,
        url: fileDataGlacier?.Location,
        file_path: fileDataGlacier?.Key,
      });
    } else if (fileData) {
      onChange({
        file_name: fileObj.name,
        url: fileData?.Location,
        file_path: fileData?.Key,
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <h2>アップロード<button
        className="select"
        type="button"
        disabled={disabled}
        onClick={handleClick}
      >
        <input
          accept="*"
          id="upload-button"
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          hidden
        />
        ファイルから選択
      </button></h2>
      <div className="deco-file">
        {value.map((obj) => (
          <label key={obj.url} className="">
            {obj.file_name}
            <Image
              src="/assets/images/up_close.svg"
              width="15"
              height="15"
              decoding="async"
              alt="close"
              className="up_close"
              onClick={() => onRemove(obj.url)}
            />
          </label>
        ))}
      </div>
    </>
  );
}

export default FileUpload;
