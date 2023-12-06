"use client"

import * as z from "zod"
import { useState, Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
// import { Undo2, Save, Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  UpdateApplyDownloadDoneMutation,
  UpdateApplyDownloadDoneDocument,
  ApplyDownload,
  CgAsset,
  User,
} from "@/graphql/generated/graphql";

// import { Button } from "@/components/ui/button"
import {
  Form,
  // FormControl,
  // FormDescription,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
// import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"

import CGAssetApplyDownloadDoneFormInput from "./apply-download-done-form-input"
import CGAssetApplyDownloadDoneFormConfirm from "./apply-download-done-form-confirm"

export const ApplyDownloadDoneFormSchema = z.object({
});

export type ApplyDownloadDoneFormValues = z.infer<typeof ApplyDownloadDoneFormSchema>

interface CGAssetApplyDownloadDoneFormProps {
  initialData: ApplyDownload | null;
  cgAsset: CgAsset | null;
  manageUsers: User[] | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    cgAssetSlug: string[];
  };
};

export const CGAssetApplyDownloadDoneForm: React.FC<CGAssetApplyDownloadDoneFormProps> = ({
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
  } : {
  }

  const form = useForm<ApplyDownloadDoneFormValues>({
    resolver: zodResolver(ApplyDownloadDoneFormSchema),
    defaultValues
  });

  const onSubmit = async (data: ApplyDownloadDoneFormValues) => {
    try {
      setLoading(true);

      const ret: FetchResult<UpdateApplyDownloadDoneMutation>
        = await apolloClient
          .mutate({
            mutation: UpdateApplyDownloadDoneDocument,
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

      toast.success('データ消去完了を報告しました。');
    } catch (error: any) {
      if (error.message) {
        toast.error(`エラー: ${error.message}`, {
          duration: 6000
        });
      } else {
        toast.error('データ消去完了の報告に失敗しました。');
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
        <Heading title="データ消去完了報告" description={`下記のデータ消去完了を報告いたします。`} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          {pageNumber === 0 && <CGAssetApplyDownloadDoneFormConfirm
            form={form}
            initialData={initialData}
            cgAsset={cgAsset}
            manageUsers={manageUsers}
            setDialogOpen={setDialogOpen}
            params={params}
            loading={loading}
            onPrev={onPrev}
          />}
          {pageNumber === 999 && <CGAssetApplyDownloadDoneFormInput
            form={form}
            initialData={initialData}
            cgAsset={cgAsset}
            manageUsers={manageUsers}
            setDialogOpen={setDialogOpen}
            params={params}
            loading={loading}
            onNext={onNext}
          />}
        </form>
      </Form>
    </>
  )
}

export default CGAssetApplyDownloadDoneForm
