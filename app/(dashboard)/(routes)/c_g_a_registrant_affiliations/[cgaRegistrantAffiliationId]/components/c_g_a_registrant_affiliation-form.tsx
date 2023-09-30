"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { apolloClient } from "@/lib/apolloClient";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgaRegistrantAffiliation,
  CreateCgaRegistrantAffiliationDocument,
  UpdateCgaRegistrantAffiliationDocument,
  DeleteCgaRegistrantAffiliationDocument,
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

type CGARegistrantAffiliationFormValues = z.infer<typeof formSchema>

interface CGARegistrantAffiliationFormProps {
  initialData: CgaRegistrantAffiliation | null;
};

export const CGARegistrantAffiliationForm: React.FC<CGARegistrantAffiliationFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? '登録者所属 編集' : '登録者所属 新規追加';
  const description = initialData ? '指定登録者所属の編集' : '新規登録者所属の追加';
  const toastMessage = initialData ? '登録者所属が更新されました。' : '登録者所属が新規追加されました。';
  const action = initialData ? '更新' : '追加';

  const form = useForm<CGARegistrantAffiliationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      desc: '',
      valid_flg: false,
    }
  });

  const onSubmit = async (data: CGARegistrantAffiliationFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await apolloClient
          .mutate({
            mutation: UpdateCgaRegistrantAffiliationDocument,
            variables: {
              id: params.cgaRegistrantAffiliationId,
              ...data
            },
          })
      } else {
        await apolloClient
          .mutate({
            mutation: CreateCgaRegistrantAffiliationDocument,
            variables: {
              ...data
            },
          })
      }
      router.refresh();
      router.push(`/c_g_a_registrant_affiliations`);
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
      await apolloClient
        .mutate({
          mutation: DeleteCgaRegistrantAffiliationDocument,
          variables: {
            id: params.cgaRegistrantAffiliationId,
          },
        })
      router.refresh();
      router.push(`/c_g_a_registrant_affiliations`);
      toast.success('登録者所属が削除されました。');
    } catch (error: any) {
      toast.error('この登録者所属を使用中のCGアセット情報が存在します。');
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
                    <Input disabled={loading} placeholder="登録者所属 表記" {...field} />
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
                      この登録者所属を選択項目として有効にする
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button" onClick={() => router.push(`/c_g_a_registrant_affiliations`)}>
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
