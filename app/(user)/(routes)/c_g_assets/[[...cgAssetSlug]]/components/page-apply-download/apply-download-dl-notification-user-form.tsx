"use client"

import * as z from "zod"
import { Fragment, useState, Dispatch, SetStateAction } from "react";
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { X, Undo2, Send, DownloadCloud } from "lucide-react"
import { format } from 'date-fns'

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  ApplyDownload,
  CgAsset,
  User,
  UpdateApplyDownloadDlNotificationDocument,
  ApplyDownloadGlacier
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
import { getAppDLGlaciers } from "@/lib/check-glacier-status";

export const ApplyDownloadDLNotificationUserFormSchema = z.object({
  // manage_user_id: z.string({ required_error: '必須選択', invalid_type_error: '選択に誤りがります' }),
  // program_id: z.string({ required_error: '必須入力', invalid_type_error: '入力に誤りがります' }),
  // program_name: z.string({ required_error: '必須入力', invalid_type_error: '入力に誤りがります' }),
  // date_usage_start: z.date({ required_error: '必須選択', invalid_type_error: '選択に誤りがります' }),
  // date_usage_end: z.date({ required_error: '必須選択', invalid_type_error: '選択に誤りがります' }),
  // purpose_of_use_txt: z
  //   .string({ required_error: '必須入力', invalid_type_error: '入力に誤りがります' })
  //   .max(1000, {
  //     message: "利用目的 は最大 1000 文字以内でご入力ください。",
  //   }),
  // etc_txt: z
  //   .string()
  //   .max(1000, {
  //     message: "その他 は最大 1000 文字以内でご入力ください。",
  //   }),
});

export type ApplyDownloadDLNotificationUserFormValues = z.infer<typeof ApplyDownloadDLNotificationUserFormSchema>

interface CGAssetApplyDownloadDLNotificationUserFormProps {
  initialData: ApplyDownload | null;
  cgAsset: CgAsset | null;
  manageUsers: User[] | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    cgAssetSlug: string[];
  };
};

export const CGAssetApplyDownloadDLNotificationUserForm: React.FC<CGAssetApplyDownloadDLNotificationUserFormProps> = ({
  initialData,
  cgAsset,
  manageUsers,
  setDialogOpen,
  params
}) => {
  // const params = useParams() as unknown as CGAssetPageProps['params'];
  const router = useRouter();
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(false);

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
    resolver: zodResolver(ApplyDownloadDLNotificationUserFormSchema),
    defaultValues
  });

  const onSubmit = async (data: ApplyDownloadDLNotificationUserFormValues) => {
    try {
      setLoading(true);

      const ret: FetchResult<{
        updateApplyDownloadRemoval: ApplyDownload;
      }> = await apolloClient
        .mutate({
          mutation: UpdateApplyDownloadDlNotificationDocument,
          variables: {
            input: {
              id: params.cgAssetSlug[2],
              user_id: (session?.user as { userId: string }).userId,
            }
          },
        })

      // console.log("ret", ret);
      if (
        ret.errors &&
        ret.errors[0] &&
        ret.errors[0].extensions &&
        ret.errors[0].extensions.debugMessage
      ) {
        throw new Error(ret.errors[0].extensions.debugMessage as string)
      } else if (
        ret.errors &&
        ret.errors[0]
      ) {
        throw new Error(ret.errors[0].message as string)
      }

      router.refresh();
      setDialogOpen(false);

      toast.success('ダウンロード済みを報告しました。');
    } catch (error: any) {
      toast.error('ダウンロード済み報告に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const download = (filename, content) => {
    var element = document.createElement("a");
    element.setAttribute("href", content);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const handleDownload = async (e, presigned_url: string) => {
    try {
      const result = await fetch(presigned_url, {
        method: "GET",
        headers: {}
      });
      const blob = await result.blob();
      const url = URL.createObjectURL(blob);
      download(cgAsset?.asset_name, url);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const appDLGlaciers = getAppDLGlaciers(cgAsset?.applyDownloads as ApplyDownload[]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="ダウンロード用 S3 Glacier 復元キュー通知内容" description={`アセットID: ${cgAsset?.asset_id} のS3 Glacier 復元キュー通知内容`} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
                    {format(new Date(field.value), "yyyy/MM/dd")}
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
                    {format(new Date(field.value), "yyyy/MM/dd")}
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
                    {field.value.split("\n").map((item, index) => {
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
                    {field.value.split("\n").map((item, index) => {
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
                      {format(new Date(field.value), "yyyy/MM/dd")}
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
                    {format(new Date(field.value), "yyyy/MM/dd")}
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col justify-items-center">
            {appDLGlaciers && appDLGlaciers.map((elem: ApplyDownloadGlacier | null) => {
              if (elem) {
                return <div key={elem.id} className="mx-auto my-2">
                  <Button
                    className=""
                    type="button"
                    onClick={(event) => handleDownload(event, elem.presigned_url as string)}
                  >
                    <DownloadCloud className="mr-2 h-4 w-4" /> ダウンロード
                  </Button>
                </div>
              }
            })}
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => setDialogOpen(false)}>
            <X className="mr-2 h-4 w-4" /> 閉じる
          </Button>
          <Button disabled={loading} className="ml-auto" type="submit">
            <Send className="mr-2 h-4 w-4" /> ダウンロード済み報告
          </Button>
        </form>
      </Form>
    </>
  )
}

export default CGAssetApplyDownloadDLNotificationUserForm
