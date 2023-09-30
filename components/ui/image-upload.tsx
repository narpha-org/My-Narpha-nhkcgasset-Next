"use client";

import { uploadImageToS3 } from '@/lib/awsS3';
import { useEffect, useState, useRef, ChangeEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImagePlus, Trash } from 'lucide-react';
import Link from 'next/link';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: ({ file_name, url, file_path }: { file_name: string, url: string, file_path: string }) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
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
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[290px] h-[160px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(url)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Link href={url} rel="noopener noreferrer" target="_blank">
              <Image
                fill
                className="object-cover"
                alt="Image"
                src={url}
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
