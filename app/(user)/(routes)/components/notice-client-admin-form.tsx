"use client"

import * as z from "zod"
import { Fragment, useState, Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { X, Undo2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { format } from 'date-fns'

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  SystemNotice,
  CreateSystemNoticeDocument,
  UpdateSystemNoticeDocument,
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
import { Textarea } from "@/components/ui/text-area"
import { Checkbox } from "@/components/ui/checkbox"
import { DateTimePicker } from "@/components/ui/date-time-picker"

export const NoticeClientAdminFormSchema = z.object({
  notice_date: z.date({
    required_error: "お知らせ日時をご指定ください",
  }),
  message: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須入力",
  }),
  valid_flg: z.boolean().default(true).optional(),
});

export type NoticeClientAdminFormValues = z.infer<typeof NoticeClientAdminFormSchema>

interface NoticeClientAdminFormProps {
  initialData: SystemNotice | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    systemNoticeId: string;
  };
};

export const NoticeClientAdminForm: React.FC<NoticeClientAdminFormProps> = ({
  initialData,
  setDialogOpen,
  params
}) => {
  // const params = useParams() as unknown as CGAssetPageProps['params'];
  const router = useRouter();
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(false);

  const title = initialData ? 'お知らせ 編集' : 'お知らせ 新規追加';
  const description = initialData ? '指定お知らせの編集' : '新規お知らせの追加';
  const toastMessage = initialData ? 'お知らせが更新されました。' : 'お知らせが新規追加されました。';
  const toastMessageFailed = initialData ? 'お知らせの更新に失敗しました。' : 'お知らせの新規追加に失敗しました。';
  const action = initialData ? '更新' : '追加';

  const defaultValues = initialData ? {
    ...initialData,
    notice_date: new Date(initialData.notice_date)
  } : {
    notice_date: new Date(),
    message: '',
    valid_flg: true,
  }

  const form = useForm<NoticeClientAdminFormValues>({
    resolver: zodResolver(NoticeClientAdminFormSchema),
    defaultValues
  });

  const onSubmit = async (data: NoticeClientAdminFormValues) => {
    try {
      setLoading(true);

      let ret: FetchResult;
      if (initialData) {
        ret = await apolloClient
          .mutate({
            mutation: UpdateSystemNoticeDocument,
            variables: {
              ...data,
              id: params.systemNoticeId,
              update_user_id: (session?.user as { userId: string }).userId,
              notice_date: format(new Date(data.notice_date), "yyyy-MM-dd HH:mm:ss"),
            },
          }) as FetchResult<{
            updateSystemNotice: SystemNotice;
          }>
      } else {
        ret = await apolloClient
          .mutate({
            mutation: CreateSystemNoticeDocument,
            variables: {
              ...data,
              create_user_id: (session?.user as { userId: string }).userId,
              notice_date: format(new Date(data.notice_date), "yyyy-MM-dd HH:mm:ss"),
            },
          }) as FetchResult<{
            createSystemNotice: SystemNotice;
          }>
      }

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
      toast.success(toastMessage);
    } catch (error: any) {
      if (error.message) {
        toast.error(`params: ${JSON.stringify(params)}`, {
          duration: 6000
        });
        toast.error(`エラー: ${error.message}`, {
          duration: 6000
        });
      } else {
        toast.error(toastMessageFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-5 gap-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>お知らせ</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="お知らせ"
                      className="h-80"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notice_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>お知らせ日時</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      date={field.value}
                      setDate={(date) => form.setValue("notice_date", date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="valid_flg"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      有効フラグ
                    </FormLabel>
                    <FormDescription>
                      このお知らせを表示項目として有効にする
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            /> */}
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => setDialogOpen(false)}>
            キャンセル
          </Button>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default NoticeClientAdminForm
