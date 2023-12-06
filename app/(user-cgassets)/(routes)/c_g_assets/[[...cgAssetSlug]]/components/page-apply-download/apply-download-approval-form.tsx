"use client"

import * as z from "zod"
import { useState, Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
// import { Undo2, Save, Plus } from "lucide-react"

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  UpdateApplyDownloadApprovalMutation,
  UpdateApplyDownloadApprovalDocument,
  ApplyDownload,
  CgAsset,
  User,
} from "@/graphql/generated/graphql";

// import { Button } from "@/components/ui/button"
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
// import { Checkbox } from "@/components/ui/checkbox"
// import { Textarea } from "@/components/ui/text-area"
import { CGAssetPageProps, CGAssetPageSlug } from "../../../../components/page-slug"

import CGAssetApplyDownloadApprovalFormInput from "./apply-download-approval-form-input"
import CGAssetApplyDownloadApprovalFormConfirm from "./apply-download-approval-form-confirm"

export const ApplyDownloadApprovalFormSchema = z.object({
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

export type ApplyDownloadApprovalFormValues = z.infer<typeof ApplyDownloadApprovalFormSchema>

interface CGAssetApplyDownloadApprovalFormProps {
  initialData: ApplyDownload | null;
  cgAsset: CgAsset | null;
  manageUsers: User[] | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    cgAssetSlug: string[];
  };
};

export const CGAssetApplyDownloadApprovalForm: React.FC<CGAssetApplyDownloadApprovalFormProps> = ({
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

  const form = useForm<ApplyDownloadApprovalFormValues>({
    resolver: zodResolver(ApplyDownloadApprovalFormSchema),
    defaultValues
  });

  const onSubmit = async (data: ApplyDownloadApprovalFormValues) => {
    try {
      setLoading(true);

      const ret: FetchResult<UpdateApplyDownloadApprovalMutation>
        = await apolloClient
          .mutate({
            mutation: UpdateApplyDownloadApprovalDocument,
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

      toast.success('ダウンロードを承認しました。');
    } catch (error: any) {
      if (error.message) {
        toast.error(`params: ${JSON.stringify(params)}`, {
          duration: 6000
        });
        toast.error(`エラー: ${error.message}`, {
          duration: 6000
        });
      } else {
        toast.error('ダウンロード承認に失敗しました。');
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
        <Heading title="ダウンロード承認" description={`アセットID: ${cgAsset?.asset_id} のダウンロードを承認する`} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          {pageNumber === 999 && <CGAssetApplyDownloadApprovalFormInput
            form={form}
            initialData={initialData}
            cgAsset={cgAsset}
            manageUsers={manageUsers}
            setDialogOpen={setDialogOpen}
            params={params}
            loading={loading}
            onNext={onNext}
          />}
          {pageNumber === 0 && <CGAssetApplyDownloadApprovalFormConfirm
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

export default CGAssetApplyDownloadApprovalForm
