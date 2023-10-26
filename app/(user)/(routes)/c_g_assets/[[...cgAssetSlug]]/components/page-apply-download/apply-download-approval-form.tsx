"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Undo2, Save, Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  ApplyDownload,
  CgAsset,
  UpdateApplyDownloadApprovalDocument,
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

const formSchema = z.object({
  agreePolicy: z.literal(true, {
    errorMap: () => ({ message: "同意が必要です" }),
  }),
  comment: z
    .string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' })
    .max(1000, {
      message: "ダウンロード承認コメント は最大 1000 文字以内でご入力ください。",
    }),
});

type CGAssetFormValues = z.infer<typeof formSchema>

interface CGAssetApplyDownloadApprovalFormProps {
  initialData: CgAsset | null;
};

export const CGAssetApplyDownloadApprovalForm: React.FC<CGAssetApplyDownloadApprovalFormProps> = ({
  initialData,
}) => {
  const params = useParams() as unknown as CGAssetPageProps['params'];
  const router = useRouter();
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(false);

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    comment: '',
  }

  const form = useForm<CGAssetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: CGAssetFormValues) => {
    try {
      setLoading(true);

      const ret: FetchResult<{
        updateApplyDownloadApproval: ApplyDownload;
      }> = await apolloClient
        .mutate({
          mutation: UpdateApplyDownloadApprovalDocument,
          variables: {
            input: {
              id: params.cgAssetSlug[2],
              user_id: (session?.user as { userId: string }).userId,
              comment: data.comment
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
      router.push(`/c_g_assets/${params.cgAssetSlug[0]}`);

      toast.success('ダウンロードを承認しました。');
    } catch (error: any) {
      toast.error('ダウンロード承認に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="ダウンロード承認" description={`アセットID: ${initialData?.asset_id} のダウンロードを承認する`} />
        <div className="flex flex-wrap justify-between">
          <div className="">
            <Button onClick={() => router.push(`/c_g_assets/${initialData?.id}`)}>
              <Undo2 className="mr-2 h-4 w-4" /> 戻る
            </Button>
          </div>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <div className="flex-grow h-36 overflow-y-auto">
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
              あああああああああああああああああああああああ<br />
            </div>
          </div>
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="agreePolicy"
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
                      同意書に同意
                    </FormLabel>
                    <FormDescription>
                      この同意書に目を通してダウンロード申請を承認します
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
                    承認に関する申請者へのコメントを入力
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => router.push(`/c_g_assets${(
              params.cgAssetSlug[0] !== CGAssetPageSlug.New ?
                "/" + params.cgAssetSlug[0] :
                ""
            )}`)}>
            <Undo2 className="mr-2 h-4 w-4" /> キャンセル
          </Button>
          <Button disabled={loading} className="ml-auto" type="submit">
            {initialData ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />} 承認する
          </Button>
        </form>
      </Form>
    </>
  )
}

export default CGAssetApplyDownloadApprovalForm