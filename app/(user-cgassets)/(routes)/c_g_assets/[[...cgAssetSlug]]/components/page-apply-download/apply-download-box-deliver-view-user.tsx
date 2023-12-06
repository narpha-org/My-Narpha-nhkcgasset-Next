"use client"

import * as z from "zod"
import { Fragment, useState, Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { X, Undo2 } from "lucide-react"
// import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { dateFormat } from "@/lib/utils"

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
import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"
import Link from "next/link"

export const ApplyDownloadBoxDeliverViewUserSchema = z.object({
  manage_user_id: z.string({ required_error: '必須選択', invalid_type_error: '選択に誤りがります' }),
  program_id: z.string({ required_error: '必須入力', invalid_type_error: '入力に誤りがります' }),
  program_name: z.string({ required_error: '必須入力', invalid_type_error: '入力に誤りがります' }),
  date_usage_start: z.date({ required_error: '必須選択', invalid_type_error: '選択に誤りがります' }),
  date_usage_end: z.date({ required_error: '必須選択', invalid_type_error: '選択に誤りがります' }),
  purpose_of_use_txt: z
    .string({ required_error: '必須入力', invalid_type_error: '入力に誤りがります' })
    .max(1000, {
      message: "利用目的 は最大 1000 文字以内でご入力ください。",
    }),
  etc_txt: z
    .string()
    .max(1000, {
      message: "その他 は最大 1000 文字以内でご入力ください。",
    }),
});

export type ApplyDownloadBoxDeliverViewUserValues = z.infer<typeof ApplyDownloadBoxDeliverViewUserSchema>

interface CGAssetApplyDownloadBoxDeliverViewUserProps {
  initialData: ApplyDownload | null;
  cgAsset: CgAsset | null;
  manageUsers: User[] | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    cgAssetSlug: string[];
  };
};

export const CGAssetApplyDownloadBoxDeliverViewUser: React.FC<CGAssetApplyDownloadBoxDeliverViewUserProps> = ({
  initialData,
  cgAsset,
  manageUsers,
  setDialogOpen,
  params
}) => {
  // const params = useParams() as unknown as CGAssetPageProps['params'];
  // const router = useRouter();
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const defaultValues = initialData ? {
    ...initialData,
    program_id: initialData?.program_id as string | undefined,
    program_name: initialData?.program_name as string | undefined,
    date_usage_start: initialData.date_usage_start ? new Date(initialData.date_usage_start) : undefined,
    date_usage_end: initialData.date_usage_end ? new Date(initialData.date_usage_end) : undefined,
    purpose_of_use_txt: initialData?.purpose_of_use_txt as string | undefined,
    etc_txt: initialData?.etc_txt as string | undefined,
  } : {
    program_id: cgAsset?.program_id as string | undefined,
    program_name: cgAsset?.program_name as string | undefined,
    purpose_of_use_txt: '',
    etc_txt: '',
  }

  const form = useForm<any>({
    resolver: zodResolver(ApplyDownloadBoxDeliverViewUserSchema),
    defaultValues
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="ダウンロード用 S3 Glacier 復元キュー通知内容" description={`アセットID: ${cgAsset?.asset_id} のS3 Glacier 復元キュー通知内容`} />
      </div>
      <Separator />
      <Form {...form}>
        <form className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="manage_user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>番組責任者</FormLabel>
                  <div>
                    {form.getValues('manageUser.name')}
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>番組ID</FormLabel>
                  <div>
                    {field.value}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="program_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>番組名</FormLabel>
                  <div>
                    {field.value}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_usage_start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>利用期間・開始</FormLabel>
                  <div>
                    {dateFormat(field.value, 'yyyy/MM/dd')}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_usage_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>利用期間・終了</FormLabel>
                  <div>
                    {dateFormat(field.value, 'yyyy/MM/dd')}
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="purpose_of_use_txt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>利用目的</FormLabel>
                  <div>
                    {field.value && field.value.split("\n").map((item, index) => {
                      return (
                        <Fragment key={index}>{item}<br /></Fragment>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="etc_txt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>その他</FormLabel>
                  <div>
                    {field.value && field.value.split("\n").map((item, index) => {
                      return (
                        <Fragment key={index}>{item}<br /></Fragment>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="box_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boxリンク</FormLabel>
                  <div>
                    {field.value && (
                      <Link href={field.value} rel="noopener noreferrer" target="_blank">
                        {field.value}
                      </Link>
                    )}
                  </div>
                </FormItem>
              )}
            /> */}
            {form.getValues('download_date') &&
              <FormField
                control={form.control}
                name="download_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ダウンロード日</FormLabel>
                    <div>
                      {dateFormat(field.value, 'yyyy/MM/dd')}
                    </div>
                  </FormItem>
                )}
              />
            }
            <FormField
              control={form.control}
              name="removal_limit_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>データ削除期限</FormLabel>
                  <div>
                    {dateFormat(field.value, 'yyyy/MM/dd')}
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => setDialogOpen(false)}>
            <X className="mr-2 h-4 w-4" /> 閉じる
          </Button>
        </form>
      </Form>
    </>
  )
}

export default CGAssetApplyDownloadBoxDeliverViewUser
