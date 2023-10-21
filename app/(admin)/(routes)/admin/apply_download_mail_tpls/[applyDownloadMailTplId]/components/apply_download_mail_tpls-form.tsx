"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  ApplyDownloadMailTpl,
  CreateApplyDownloadMailTplDocument,
  UpdateApplyDownloadMailTplDocument,
  DeleteApplyDownloadMailTplDocument,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { statusApplyDownloads } from "../../components/columns"

const formSchema = z.object({
  status: z.string({ required_error: '必須選択', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須選択",
  }),
  subject_tpl: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須入力",
  }),
  body_tpl: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須入力",
  }),
  from_mail: z.string().optional(),
  bcc_mail: z.string().optional(),
  valid_flg: z.boolean().default(false).optional(),
});

type ApplyDownloadMailTplFormValues = z.infer<typeof formSchema>

interface ApplyDownloadMailTplFormProps {
  initialData: ApplyDownloadMailTpl | null;
};

export const ApplyDownloadMailTplForm: React.FC<ApplyDownloadMailTplFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'ホーム画面: 申請メールテンプレート 編集' : 'ホーム画面: 申請メールテンプレート 新規追加';
  const description = initialData ? '指定申請メールテンプレートの編集' : '新規申請メールテンプレートの追加';
  const toastMessage = initialData ? '申請メールテンプレートが更新されました。' : '申請メールテンプレートが新規追加されました。';
  const action = initialData ? '更新' : '追加';

  const defaultValues = initialData ? {
    ...initialData,
    from_mail: initialData?.from_mail as string | undefined,
    bcc_mail: initialData?.bcc_mail as string | undefined,
  } : {
    status: '',
    subject_tpl: '',
    body_tpl: '',
    from_mail: '',
    bcc_mail: '',
    valid_flg: false,
  }

  const form = useForm<ApplyDownloadMailTplFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ApplyDownloadMailTplFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await apolloClient
          .mutate({
            mutation: UpdateApplyDownloadMailTplDocument,
            variables: {
              id: params.applyDownloadMailTplId,
              ...data
            },
          })
      } else {
        await apolloClient
          .mutate({
            mutation: CreateApplyDownloadMailTplDocument,
            variables: {
              ...data
            },
          })
      }
      router.refresh();
      router.push(`/admin/apply_download_mail_tpls`);
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
      const ret = await apolloClient
        .mutate({
          mutation: DeleteApplyDownloadMailTplDocument,
          variables: {
            id: params.applyDownloadMailTplId,
          },
        })

      // console.log("ret", ret);
      if (ret.errors && ret.errors[0] && ret.errors[0].message) {
        throw new Error(ret.errors[0].message)
      }

      router.refresh();
      router.push(`/admin/apply_download_mail_tpls`);
      toast.success('申請メールテンプレートが削除されました。');
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>申請ステータス</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="申請ステータスの選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusApplyDownloads.map((statusApplyDownload) => (
                        <SelectItem key={statusApplyDownload.key} value={statusApplyDownload.key}>{statusApplyDownload.key} ({statusApplyDownload.value})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject_tpl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メール題名</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="メール題名" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    アセット名: %ASSET_NAME%<br />
                    申請するユーザ名: %ASSET_USER_NAME%<br />
                    申請先ユーザ名: %ADMIN_USER_NAME%<br />
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body_tpl"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>メール本文</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="メール本文"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    アセット名: %ASSET_NAME%<br />
                    申請するユーザ名: %ASSET_USER_NAME%<br />
                    申請先ユーザ名: %ADMIN_USER_NAME%<br />
                    申請者メッセージ: %ASSET_USER_MESSAGE%<br />
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="from_mail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>送信元メールアドレス</FormLabel>
                  <FormControl>
                    <Input type="email" disabled={loading} placeholder="info@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bcc_mail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BCCメールアドレス</FormLabel>
                  <FormControl>
                    <Input type="email" disabled={loading} placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valid_flg"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
                      この申請メールテンプレートを選択項目として有効にする
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => router.push(`/admin/apply_download_mail_tpls`)}>
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
