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
  }, {
    invalid_type_error: "アップロードファイル未選択",
    required_error: "アップロードファイル未選択",
  }),
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
    assetBulkExcel: null as unknown as UploadFileProps | undefined,
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
      toast.success(`CGアセットが${importCGAssets?.total}件一括登録されました。`, {
        duration: 4000
      });
      form.reset();
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
                  <FormDescription>
                    [Excel見出し]<br />
                    <br />
                    id:                        : Database id (指定時は更新)<br />
                    asset_id:                  : アセットID (未指定時は自動採番)<br />
                    <br />
                    asset_name:                : アセット名<br />
                    asset_cate_id:             : アセット種別<br />
                    asset_app_prod:            : 制作アプリ<br />
                    asset_format:              : 形式<br />
                    asset_size:                : サイズ<br />
                    asset_renderer:            : レンダラ<br />
                    program_id:                : 番組ID<br />
                    program_name:              : 番組名<br />
                    registrant_affiliation_id: : 登録者所属<br />
                    viewing_restriction_id:    : 閲覧制限<br />
                    broadcasting_right_id:     : 放送権利<br />
                    shared_area_id:            : 公開エリア<br />
                    rights_supplement:         : 権利補足（使用上の注意）<br />
                    asset_detail:              : アセット詳細説明<br />
                    download_count:            : ダウンロード数<br />
                    uploadDirId:               : アップロード場所<br />
                    create_user_id:            : 登録ユーザ<br />
                    update_user_id:            : 更新ユーザ<br />
                    valid_flg:                 : 有効フラグ<br />
                    created_at:                : 登録日時<br />
                    updated_at:                : 更新日時<br />
                    <br />
                    3dcg_1_file_path           : アセット3DCG・ファイルパス<br />
                    3dcg_1_file_name           : アセット3DCG・ファイル名<br />
                    3dcg_1_file_url            : アセット3DCG・ファイルURL<br />
                    3dcg_1_thumb_path          : アセット3DCG・サムネイルパス<br />
                    3dcg_1_thumb_name          : アセット3DCG・サムネイル名<br />
                    3dcg_1_thumb_url           : アセット3DCG・サムネイルURL<br />
                    <br />
                    video_1_file_path           : アセット動画1・ファイルパス<br />
                    video_1_file_name           : アセット動画1・ファイル名<br />
                    video_1_file_url            : アセット動画1・ファイルURL<br />
                    video_1_thumb_path          : アセット動画1・サムネイルパス<br />
                    video_1_thumb_name          : アセット動画1・サムネイル名<br />
                    video_1_thumb_url           : アセット動画1・サムネイルURL<br />
                    ...<br />
                    video_4_file_path           : アセット動画4・ファイルパス<br />
                    video_4_file_name           : アセット動画4・ファイル名<br />
                    video_4_file_url            : アセット動画4・ファイルURL<br />
                    video_4_thumb_path          : アセット動画4・サムネイルパス<br />
                    video_4_thumb_name          : アセット動画4・サムネイル名<br />
                    video_4_thumb_url           : アセット動画4・サムネイルURL<br />
                    <br />
                    image_1_file_path           : アセット画像1・ファイルパス<br />
                    image_1_file_name           : アセット画像1・ファイル名<br />
                    image_1_file_url            : アセット画像1・ファイルURL<br />
                    image_1_thumb_path          : アセット画像1・サムネイルパス<br />
                    image_1_thumb_name          : アセット画像1・サムネイル名<br />
                    image_1_thumb_url           : アセット画像1・サムネイルURL<br />
                    ...<br />
                    image_20_file_path           : アセット画像20・ファイルパス<br />
                    image_20_file_name           : アセット画像20・ファイル名<br />
                    image_20_file_url            : アセット画像20・ファイルURL<br />
                    image_20_thumb_path          : アセット画像20・サムネイルパス<br />
                    image_20_thumb_name          : アセット画像20・サムネイル名<br />
                    image_20_thumb_url           : アセット画像20・サムネイルURL<br />
                  </FormDescription>
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
