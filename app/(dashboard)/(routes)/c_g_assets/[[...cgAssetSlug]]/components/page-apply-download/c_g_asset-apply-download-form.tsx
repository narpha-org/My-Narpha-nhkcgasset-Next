"use client"

import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react"

import {
  CgAsset,
} from "@/graphql/generated/graphql";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface CGAssetApplyDownloadFormProps {
  initialData: CgAsset | null;
};

export const CGAssetApplyDownloadForm: React.FC<CGAssetApplyDownloadFormProps> = ({
  initialData,
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="ダウンロード申請" description={`アセットID: ${initialData?.asset_id} のダウンロードを申請する`} />
        <div className="flex flex-wrap justify-between">
          <div className="">
            <Button onClick={() => router.push(`/c_g_assets/${initialData?.id}`)}>
              <Undo2 className="mr-2 h-4 w-4" /> 戻る
            </Button>
          </div>
        </div>
      </div>
      <Separator />
    </>
  )
}

export default CGAssetApplyDownloadForm