"use client";

import { uploadImageToS3 } from '@/lib/aws-s3';
import { useEffect, useState, useRef, ChangeEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FileVideo, Trash } from 'lucide-react';
import Link from 'next/link';

export type UploadFileProps = {
  file_name: string;
  url: string;
  file_path: string;
  thumb_file_name: string;
  thumb_url: string;
  thumb_file_path: string;
}

interface FileUploadSingleProps {
  disabled?: boolean;
  onChange: ({ file_name, url, file_path, thumb_file_name, thumb_url, thumb_file_path }: UploadFileProps) => void;
  onRemove: (value: string) => void;
  value: UploadFileProps | null;
  poster: string;
}

const FileUploadSingle: React.FC<FileUploadSingleProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  poster
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

    const fileData = await uploadImageToS3(fileObj);

    console.log(fileData?.Bucket);
    console.log(fileData?.Key);
    console.log(fileData?.Location);

    if (fileData) {
      onChange({
        file_name: fileObj.name,
        url: fileData?.Location,
        file_path: fileData?.Key,
        thumb_file_name: '',
        thumb_url: '',
        thumb_file_path: '',
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        {value && (
          <div key={value.url} className="relative w-[290px] h-[160px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(value.url)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Link href={value.url} rel="noopener noreferrer" target="_blank">
              <Image
                fill
                className="object-cover"
                alt="Image"
                src={value.thumb_url ? value.thumb_url : poster}
              />
            </Link>
          </div>
        )}
      </div>
      <Button
        type="button"
        disabled={disabled}
        variant="secondary"
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
        <FileVideo className="h-4 w-4 mr-2" />
        アップロード
      </Button>
    </>
  );
}

export default FileUploadSingle;
