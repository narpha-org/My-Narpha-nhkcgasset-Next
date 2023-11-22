"use client"

import * as z from "zod"
import { useState, Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
// import { Undo2 } from "lucide-react"
import { format } from 'date-fns'

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CreateApplyDownloadMutation,
  CreateApplyDownloadDocument,
  ApplyDownload,
  CgAsset,
  User,
} from "@/graphql/generated/graphql";

// import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
// import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"

import CGAssetApplyDownloadFormInput from "./apply-download-form-input"
import CGAssetApplyDownloadFormConfirm from "./apply-download-form-confirm"

export const ApplyDownloadFormSchema = z.object({
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

export type ApplyDownloadFormValues = z.infer<typeof ApplyDownloadFormSchema>

interface CGAssetApplyDownloadFormProps {
  initialData: ApplyDownload | null;
  cgAsset: CgAsset | null;
  manageUsers: User[] | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    cgAssetSlug: string[];
  };
};

export const CGAssetApplyDownloadForm: React.FC<CGAssetApplyDownloadFormProps> = ({
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

  const form = useForm<ApplyDownloadFormValues>({
    resolver: zodResolver(ApplyDownloadFormSchema),
    defaultValues
  });

  const onSubmit = async (data: ApplyDownloadFormValues) => {
    try {
      setLoading(true);

      const ret: FetchResult<CreateApplyDownloadMutation>
        = await apolloClient
          .mutate({
            mutation: CreateApplyDownloadDocument,
            variables: {
              input: {
                asset_db_id: params.cgAssetSlug[0],
                user_id: (session?.user as { userId: string }).userId,
                ...data,
                date_usage_start: format(new Date(data.date_usage_start), "yyyy-MM-dd 00:00:00"),
                date_usage_end: format(new Date(data.date_usage_end), "yyyy-MM-dd 00:00:00"),
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

      toast.success('ダウンロードを申請しました。');
    } catch (error: any) {
      if (error.message) {
        toast.error(`エラー: ${error.message}`, {
          duration: 6000
        });
      } else {
        toast.error('ダウンロード申請に失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  const onNext = () => {
    setPageNumber(state => state + 1);
  };

  const onPrev = () => {
    setPageNumber(state => state - 1);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="ダウンロード申請" description={`アセットID: ${cgAsset?.asset_id} のダウンロードを申請する`} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          {pageNumber === 0 && <CGAssetApplyDownloadFormInput
            form={form}
            initialData={initialData}
            cgAsset={cgAsset}
            manageUsers={manageUsers}
            setDialogOpen={setDialogOpen}
            params={params}
            loading={loading}
            onNext={onNext}
          />}
          {pageNumber === 1 && <CGAssetApplyDownloadFormConfirm
            form={form}
            initialData={initialData}
            cgAsset={cgAsset}
            manageUsers={manageUsers}
            setDialogOpen={setDialogOpen}
            params={params}
            loading={loading}
            onPrev={onPrev}
          />}
        </form>
      </Form>
    </>
  )
}

export default CGAssetApplyDownloadForm