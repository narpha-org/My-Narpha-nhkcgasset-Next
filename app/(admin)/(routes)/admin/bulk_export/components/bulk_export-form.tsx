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
  ExportCgAssetsQuery,
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

      const ret: ApolloQueryResult<ExportCgAssetsQuery>
        = await apolloClient
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
      router.replace(`${exportCGAssets?.file_url}`);
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
        <Heading title={`CGアセット データエクスポート`} description="アセット情報Excelとしてデータをエクスポート" />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <div>
              <div className="mt-8">
                <Button disabled={loading} className="ml-auto" type="submit">
                  <Download className="mr-2 h-4 w-4" /> エクスポート
                </Button>
              </div>
            </div>
            <div>
              [Excel見出し]<br />
              <br />
              id:                       : Database id<br />
              asset_id                  : アセットID<br />
              <br />
              asset_name                : アセット名<br />
              asset_cate                : アセット種別<br />
              asset_genre               : ジャンル<br />
              asset_app_prod            : 制作ソフトウェア<br />
              asset_format              : 形式<br />
              asset_size                : サイズ<br />
              asset_renderer            : レンダラ<br />
              program_id                : 番組ID<br />
              program_name              : 番組名<br />
              registrant_affiliation    : 登録者所属<br />
              viewing_restriction       : 閲覧制限<br />
              broadcasting_right        : 放送権利<br />
              shared_area               : 公開エリア<br />
              rights_supplement         : 権利補足（使用上の注意）<br />
              asset_detail              : アセット詳細説明<br />
              download_count            : ダウンロード数<br />
              upload_dir                : アップロード場所<br />
              create_user               : 登録ユーザ<br />
              update_user               : 更新ユーザ<br />
              valid_flg                 : 有効フラグ<br />
              created_at                : 登録日時<br />
              updated_at                : 更新日時<br />
              <br />
              tags_admin                : タグ（管理者登録）<br />
              tags_user                 : タグ（一般ユーザ追加）<br />
              {/* <br />
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
              image_20_thumb_url           : アセット画像20・サムネイルURL<br /> */}
              <br />
              upload_1_file_path      : アセットアップロード1・ファイルパス<br />
              upload_1_file_name      : アセットアップロード1・ファイル名<br />
              upload_1_url            : アセットアップロード1・ファイルURL<br />
              ...<br />
              upload_20_file_path     : アセットアップロード20・ファイルパス<br />
              upload_20_file_name     : アセットアップロード20・ファイル名<br />
              upload_20_url           : アセットアップロード20・ファイルURL<br />
              <br />
              thumb_1_file_path       : アセットサムネイル1・サムネイルパス<br />
              thumb_1_file_name       : アセットサムネイル1・サムネイル名<br />
              thumb_1_url             : アセットサムネイル1・サムネイルURL<br />
              ...<br />
              thumb_20_file_path      : アセットサムネイル20・サムネイルパス<br />
              thumb_20_file_name      : アセットサムネイル20・サムネイル名<br />
              thumb_20_url            : アセットサムネイル20・サムネイルURL<br />

            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
