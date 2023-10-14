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
  CgaBroadcastingRight,
  CreateCgaBroadcastingRightDocument,
  UpdateCgaBroadcastingRightDocument,
  DeleteCgaBroadcastingRightDocument,
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
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  desc: z.string().min(1),
  valid_flg: z.boolean().default(false).optional(),
});

type CGaBroadcastingRightFormValues = z.infer<typeof formSchema>

interface CGaBroadcastingRightFormProps {
  initialData: CgaBroadcastingRight | null;
};

export const CGaBroadcastingRightForm: React.FC<CGaBroadcastingRightFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? '放送権利 編集' : '放送権利 新規追加';
  const description = initialData ? '指定放送権利の編集' : '新規放送権利の追加';
  const toastMessage = initialData ? '放送権利が更新されました。' : '放送権利が新規追加されました。';
  const action = initialData ? '更新' : '追加';

  const form = useForm<CGaBroadcastingRightFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      desc: '',
      valid_flg: false,
    }
  });

  const onSubmit = async (data: CGaBroadcastingRightFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await apolloClient
          .mutate({
            mutation: UpdateCgaBroadcastingRightDocument,
            variables: {
              id: params.cgaBroadcastingRightId,
              ...data
            },
          })
      } else {
        await apolloClient
          .mutate({
            mutation: CreateCgaBroadcastingRightDocument,
            variables: {
              ...data
            },
          })
      }
      router.refresh();
      router.push(`/admin/c_g_a_broadcasting_rights`);
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
          mutation: DeleteCgaBroadcastingRightDocument,
          variables: {
            id: params.cgaBroadcastingRightId,
          },
        })

      // console.log("ret", ret);
      if (ret.errors && ret.errors[0] && ret.errors[0].message) {
        throw new Error(ret.errors[0].message)
      }

      router.refresh();
      router.push(`/admin/c_g_a_broadcasting_rights`);
      toast.success('放送権利が削除されました。');
    } catch (error: any) {
      toast.error('この放送権利を使用中のCGアセット情報が存在します。');
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
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>表記</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="放送権利 表記" {...field} />
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
                      この放送権利を選択項目として有効にする
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => router.push(`/admin/c_g_a_broadcasting_rights`)}>
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