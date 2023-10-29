"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Upload } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  ImportCgAssets,
  ImportCgAssetsDocument,
} from "@/graphql/generated/graphql";

// import { Input } from "@/components/ui/input"
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
import FileUploadSingle, { UploadFileProps } from "@/components/ui/file-upload-single"

const formSchema = z.object({
  assetBulkExcel: z.object({
    file_name: z.string(),
    url: z.string(),
    file_path: z.string(),
    thumb_file_name: z.string().min(0),
    thumb_url: z.string().min(0),
    thumb_file_path: z.string().min(0)
  }).nullable(),
  // excel_file: z.custom<FileList>()
  //   .refine((file) => file.length !== 0, { message: '必須です' })
  //   .transform((file) => file[0])
  //   .refine((file) => file.size < 5000000, { message: 'ファイルサイズは最大50MBです' })
  //   .refine((file) => ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type), {
  //     message: '.xlsxのみ可能です',
  //   }),
});

type BulkRegistrationFormValues = z.infer<typeof formSchema>

interface BulkRegistrationFormProps { };

export const BulkRegistrationForm: React.FC<BulkRegistrationFormProps> = ({ }) => {
  // const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession()

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    assetBulkExcel: null as unknown as UploadFileProps | null | undefined,
    // excel_file: null as unknown as File
  }

  const form = useForm<BulkRegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: BulkRegistrationFormValues) => {
    try {
      setLoading(true);

      const ret: FetchResult<{
        importCGAssets: ImportCgAssets;
      }> = await apolloClient
        .mutate({
          mutation: ImportCgAssetsDocument,
          variables: {
            input: {
              create_user_id: (session?.user as { userId: string }).userId,
              ...data,
            }
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

      const importCGAssets = ret.data?.importCGAssets;

      router.refresh();
      router.push(`/admin/bulk_registration`);
      toast.success(`CGアセットが${importCGAssets?.total}件一括登録されました。`, {
        duration: 4000
      });
    } catch (error: any) {
      if (error.message) {
        toast.error(`エラー: ${error.message}`, {
          duration: 6000
        });
      } else {
        toast.error('CGアセットの一括登録に失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`データ一括登録`} description="アセット情報Excelからデータを一括登録" />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* <FormField
              control={form.control}
              name="excel_file"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel htmlFor="excel_file">CGアセットデータExcel</FormLabel>
                  <FormControl>
                    <Input disabled={loading} id="excel_file" type="file"
                      onChange={(e) => onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="assetBulkExcel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CGアセットデータExcel</FormLabel>
                  <FormControl>
                    <FileUploadSingle
                      value={field.value}
                      disabled={loading}
                      onChange={({
                        file_name,
                        url,
                        file_path,
                        thumb_file_name,
                        thumb_url,
                        thumb_file_path
                      }) => field.onChange({
                        file_name,
                        url,
                        file_path,
                        thumb_file_name,
                        thumb_url,
                        thumb_file_path
                      })}
                      onRemove={(url) => field.onChange(null)}
                      poster="/images/upload_excel.png"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            <Upload className="mr-2 h-4 w-4" /> 一括登録
          </Button>
        </form>
      </Form>
    </>
  );
};
