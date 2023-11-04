"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { format } from 'date-fns'

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  SystemNotice,
  CreateSystemNoticeDocument,
  UpdateSystemNoticeDocument,
  DeleteSystemNoticeDocument,
} from "@/graphql/generated/graphql";

import { Input } from "@/components/ui/input"
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
import { AlertModal } from "@/components/modals/alert-modal"
import { Textarea } from "@/components/ui/text-area"
import { Checkbox } from "@/components/ui/checkbox"
import { DateTimePicker } from "@/components/ui/date-time-picker"

const formSchema = z.object({
  notice_date: z.date({
    required_error: "お知らせ日時をご指定ください",
  }),
  message: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須入力",
  }),
  valid_flg: z.boolean().default(false).optional(),
});

type SystemNoticeFormValues = z.infer<typeof formSchema>

interface SystemNoticeFormProps {
  initialData: SystemNotice | null;
};

export const SystemNoticeForm: React.FC<SystemNoticeFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession()

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'ホーム画面: お知らせ 編集' : 'ホーム画面: お知らせ 新規追加';
  const description = initialData ? '指定お知らせの編集' : '新規お知らせの追加';
  const toastMessage = initialData ? 'お知らせが更新されました。' : 'お知らせが新規追加されました。';
  const action = initialData ? '更新' : '追加';

  const defaultValues = initialData ? {
    ...initialData,
    notice_date: new Date(initialData.notice_date)
  } : {
    notice_date: new Date(),
    message: '',
    valid_flg: false,
  }

  const form = useForm<SystemNoticeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: SystemNoticeFormValues) => {
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
      router.push(`/admin/system_notices`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      const ret: FetchResult<{
        DeleteSystemNotice: SystemNotice;
      }> = await apolloClient
        .mutate({
          mutation: DeleteSystemNoticeDocument,
          variables: {
            id: params.systemNoticeId,
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
      router.push(`/admin/system_notices`);
      toast.success('お知らせが削除されました。');
    } catch (error: any) {
      toast.error('削除できません。');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
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
            <FormField
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
            />
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => router.push(`/admin/system_notices`)}>
            キャンセル
          </Button>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
