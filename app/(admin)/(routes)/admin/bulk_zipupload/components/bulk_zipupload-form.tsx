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
  ImportZipCgAssets,
  ImportZipCgAssetsDocument,
  ImportZipCgAssetsMutation,
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
  assetBulkZip: z.object({
    file_name: z.string(),
    url: z.string(),
    file_path: z.string(),
    thumb_file_name: z.string().min(0),
    thumb_url: z.string().min(0),
    thumb_file_path: z.string().min(0)
  }, {
    invalid_type_error: "アップロードファイル未選択",
    required_error: "アップロードファイル未選択",
  }),
  // zip_file: z.custom<FileList>()
  //   .refine((file) => file.length !== 0, { message: '必須です' })
  //   .transform((file) => file[0])
  //   .refine((file) => file.size < 5000000000, { message: 'ファイルサイズは最大50GBです' })
  //   .refine((file) => ['application/zip'].includes(file.type), {
  //     message: '.zipのみ可能です',
  //   }),
});

type BulkZipUploadFormValues = z.infer<typeof formSchema>

interface BulkZipUploadFormProps { };

export const BulkZipUploadForm: React.FC<BulkZipUploadFormProps> = ({ }) => {
  // const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession()

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    assetBulkZip: null as unknown as UploadFileProps | undefined,
    // zip_file: null as unknown as File
  }

  const form = useForm<BulkZipUploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: BulkZipUploadFormValues) => {
    try {
      setLoading(true);

      const ret: FetchResult<ImportZipCgAssetsMutation>
        = await apolloClient
          .mutate({
            mutation: ImportZipCgAssetsDocument,
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

      const importZipCGAssets = ret.data?.importZipCGAssets;

      let successMessage: string;
      if (importZipCGAssets?.total === -1) {
        successMessage = `CGアセット一括登録がタスクキューに追加されました。登録はバックグラウンドで実行されます。`;
      } else {
        successMessage = `CGアセットが${importZipCGAssets?.total}件一括登録されました。`;
      }

      form.reset();
      router.refresh();
      toast.success(successMessage, {
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

  const json_sample = {
    "ID": "[任意の半角数字ID]",
    "登録名": "共通セット　汎用　しとみ塀 ",
    "番組名": "DXプロジェクト（どうする家康）",
    "公開状態": "公開",
    "登録日時": "Sept. 15, 2023, 5:16 p.m.",
    "最終更新": "Oct. 11, 2023, 2:05 p.m.",
    "ZipFile": "[任意のZipファイル表記]__ID_[任意の半角数字ID].zip",
    "Software": "Maya Arnold",
    "Plugins": "None",
    "Keywords": "リピート塀　共通セット",
    "詳細説明": "詳細説明詳細説明詳細説明。詳細説明詳細説明。詳細説明。",
    "カテゴリ": [
      "アセット開発",
      "建物_戦国時代",
      "門・塀・垣"
    ],
    "作者": "NHKアート",
    "4K": "4K対応"
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`CGアセット データZip一括登録`} description="アセット情報Zipファイルからデータを一括登録" />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <div>
              <FormField
                control={form.control}
                name="assetBulkZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CGアセットデータZipファイル</FormLabel>
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
                        poster="/images/upload_zip.png"
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="mt-8">
                <Button disabled={loading} className="ml-auto" type="submit">
                  <Upload className="mr-2 h-4 w-4" /> 一括登録
                </Button>
              </div>
            </div>
            <div>
              [Zipファイル構成]<br />
              <br />
              ID[任意の半角数字ID].json<br />
              <br />
              <div><pre>{JSON.stringify(json_sample, null, 4)}</pre></div>
              <br />
              image_ID[任意の半角数字ID].jpg<br />
              [任意のZipファイル表記]__ID_[任意の半角数字ID].zip<br />
              ...<br />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
