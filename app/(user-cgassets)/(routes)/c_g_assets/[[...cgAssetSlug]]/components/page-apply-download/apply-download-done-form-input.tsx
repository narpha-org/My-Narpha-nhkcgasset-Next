"use client"

import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { X, Save, Check } from "lucide-react"
// import { useParams, useRouter } from "next/navigation"

import {
  ApplyDownload,
  CgAsset,
  User,
} from "@/graphql/generated/graphql";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/text-area"
import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"

interface CGAssetApplyDownloadDoneFormInputProps {
  form: UseFormReturn<any>;
  initialData: ApplyDownload | null;
  cgAsset: CgAsset | null;
  manageUsers: User[] | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    cgAssetSlug: string[];
  };
  loading: boolean;
  onNext: () => void;
};

export const CGAssetApplyDownloadDoneFormInput: React.FC<CGAssetApplyDownloadDoneFormInputProps> = ({
  form,
  initialData,
  cgAsset,
  manageUsers,
  setDialogOpen,
  params,
  loading,
  onNext
}) => {
  // const params = useParams() as unknown as CGAssetPageProps['params'];
  // const router = useRouter();

  return (
    <>
      <div className="md:grid md:grid-cols-3 gap-8">
        <FormField
          control={form.control}
          name="checkAction"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  disabled={loading}
                  // @ts-ignore
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  アセットデータ削除確認
                </FormLabel>
                <FormDescription>
                  該当アセットデータを削除済みであることを確認します
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
      <div className="md:grid md:grid-cols-3 gap-8">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>コメント</FormLabel>
              <FormControl>
                <Textarea
                  disabled={loading}
                  placeholder="コメントを記述"
                  className=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                アセットデータ削除に関する番組責任者へのコメントを入力
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
      <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
        onClick={() => setDialogOpen(false)}>
        <X className="mr-2 h-4 w-4" /> 閉じる
      </Button>
      <Button disabled={loading} className="ml-auto" type="button" onClick={form.handleSubmit(onNext)}>
        {initialData ? <Save className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />} 確認
      </Button>
    </>
  )
}

export default CGAssetApplyDownloadDoneFormInput
