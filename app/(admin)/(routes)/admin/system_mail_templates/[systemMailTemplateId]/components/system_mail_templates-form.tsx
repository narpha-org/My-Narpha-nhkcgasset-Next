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
  SystemMailTemplate,
  CreateSystemMailTemplateDocument,
  UpdateSystemMailTemplateDocument,
  DeleteSystemMailTemplateDocument,
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

import { codeMailTemplates } from "../../components/columns"

const formSchema = z.object({
  code: z.string({ required_error: '必須選択', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須選択",
  }),
  subject_tpl: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須入力",
  }),
  body_tpl: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須入力",
  }),
  from_mail: z.string().nullish(),
  bcc_mail: z.string().nullish(),
  valid_flg: z.boolean().default(false).optional(),
});

type SystemMailTemplateFormValues = z.infer<typeof formSchema>

interface SystemMailTemplateFormProps {
  initialData: SystemMailTemplate | null;
};

export const SystemMailTemplateForm: React.FC<SystemMailTemplateFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'メールテンプレート 編集' : 'メールテンプレート 新規追加';
  const description = initialData ? '指定メールテンプレートの編集' : '新規メールテンプレートの追加';
  const toastMessage = initialData ? 'メールテンプレートが更新されました。' : 'メールテンプレートが新規追加されました。';
  const action = initialData ? '更新' : '追加';

  const defaultValues = initialData ? {
    ...initialData,
    from_mail: initialData?.from_mail as string | undefined,
    bcc_mail: initialData?.bcc_mail as string | undefined,
  } : {
    code: '',
    subject_tpl: '',
    body_tpl: '',
    from_mail: '',
    bcc_mail: '',
    valid_flg: false,
  }

  const form = useForm<SystemMailTemplateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: SystemMailTemplateFormValues) => {
    try {
      setLoading(true);

      let ret: FetchResult;
      if (initialData) {
        ret = await apolloClient
          .mutate({
            mutation: UpdateSystemMailTemplateDocument,
            variables: {
              id: params.systemMailTemplateId,
              ...data
            },
          }) as FetchResult<{
            updateSystemMailTemplate: SystemMailTemplate;
          }>
      } else {
        ret = await apolloClient
          .mutate({
            mutation: CreateSystemMailTemplateDocument,
            variables: {
              ...data
            },
          }) as FetchResult<{
            createSystemMailTemplate: SystemMailTemplate;
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
      router.push(`/admin/system_mail_templates`);
      toast.success(toastMessage);
    } catch (error: any) {
      if (error.message === "_CODE_IS_NOT_UNIQUE_OR_INVALID_") {
        toast.error("登録済みのメール区分です。");
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      const ret: FetchResult<{
        DeleteSystemMailTemplate: SystemMailTemplate;
      }> = await apolloClient
        .mutate({
          mutation: DeleteSystemMailTemplateDocument,
          variables: {
            id: params.systemMailTemplateId,
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
      router.push(`/admin/system_mail_templates`);
      toast.success('メールテンプレートが削除されました。');
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メール区分</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="メール区分の選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {codeMailTemplates.map((codeMailTemplate) => (
                        <SelectItem key={codeMailTemplate.key} value={codeMailTemplate.key}>{codeMailTemplate.value}</SelectItem>
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
                    アセットID: %ASSET_ID%<br />
                    アセット名: %ASSET_NAME%<br />
                    FROMユーザ名: %FROM_USER_NAME%<br />
                    TOユーザ名: %TO_USER_NAME%<br />
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
                      className="h-80"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    アセットID: %ASSET_ID%<br />
                    アセット名: %ASSET_NAME%<br />
                    FROMユーザ名: %FROM_USER_NAME%<br />
                    TOユーザ名: %TO_USER_NAME%<br />
                    アセットURL: %ASSET_URL%<br />
                    <br />
                    申請ユーザ名: %APPLY_USER_NAME%<br />
                    番組ID: %APPLY_PROGRAM_ID%<br />
                    番組名: %APPLY_PROGRAM_NAME%<br />
                    利用期間・開始日: %APPLY_DATE_USAGE_START%<br />
                    利用期間・終了日: %APPLY_DATE_USAGE_END%<br />
                    利用目的テキスト: %APPLY_PURPOSE_OF_USE_TXT%<br />
                    その他テキスト: %APPLY_ETC_TXT%<br />
                    Boxリンク: %APPLY_BOX_LINK%<br />
                    ダウンロード日: %APPLY_DATE_DOWNLOAD%<br />
                    データ削除期限: %APPLY_DATE_REMOVAL%<br />
                    <br />
                    発信メッセージ: %ASSET_USER_MESSAGE%<br />
                    未決リスト: %PENDING_LIST%<br />
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
                    {/* @ts-ignore */}
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
                    {/* @ts-ignore */}
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
                      このメールテンプレートを選択項目として有効にする
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => router.push(`/admin/system_mail_templates`)}>
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
