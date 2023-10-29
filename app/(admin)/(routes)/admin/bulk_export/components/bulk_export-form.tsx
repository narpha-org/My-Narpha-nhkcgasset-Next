"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Download } from "lucide-react";
import { useParams, useRouter } from "next/navigation"

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  ExportCgAssets,
  ExportCgAssetsDocument,
} from "@/graphql/generated/graphql";

import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

const formSchema = z.object({});

type BulkExportFormValues = z.infer<typeof formSchema>

interface BulkExportFormProps { };

export const BulkExportForm: React.FC<BulkExportFormProps> = ({ }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const form = useForm<BulkExportFormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: BulkExportFormValues) => {
    try {
      setLoading(true);

      const ret: ApolloQueryResult<{
        exportCGAssets: ExportCgAssets
      }> = await apolloClient
        .query({
          query: ExportCgAssetsDocument,
          variables: {
            id: params.cgaBroadcastingRightId
          },
        });

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

      const exportCGAssets = ret.data.exportCGAssets;

      router.refresh();
      router.replace(`${exportCGAssets.file_url}`);
      toast.success("エクスポートしました。", {
        duration: 4000
      });
    } catch (error: any) {
      if (error.message) {
        toast.error(`エラー: ${error.message}`, {
          duration: 6000
        });
      } else {
        toast.error('エクスポートに失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`データエクスポート`} description="アセット情報Excelとしてデータをエクスポート" />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <Button disabled={loading} className="ml-auto" type="submit">
            <Download className="mr-2 h-4 w-4" /> エクスポート
          </Button>
        </form>
      </Form>
    </>
  );
};
