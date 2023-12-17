"use client"

import * as z from "zod"
import { Fragment, useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";
// import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { X, Undo2 } from "lucide-react"
// import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { dateFormat } from "@/lib/utils"

import {
  ApplyDownload,
  CgAsset,
  User,
} from "@/graphql/generated/graphql";

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
import { getAppDLGlaciers } from "@/lib/check-glacier-status";

import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"
import { getAssetMedias } from "../page-detail/asset-media";

export const ApplyDownloadBoxDeliverViewUserSchema = z.object({
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

export type ApplyDownloadBoxDeliverViewUserValues = z.infer<typeof ApplyDownloadBoxDeliverViewUserSchema>

interface CGAssetApplyDownloadBoxDeliverViewUserProps {
  initialData: ApplyDownload | null;
  cgAsset: CgAsset | null;
  manageUsers: User[] | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    cgAssetSlug: string[];
  };
};

export const CGAssetApplyDownloadBoxDeliverViewUser: React.FC<CGAssetApplyDownloadBoxDeliverViewUserProps> = ({
  initialData,
  cgAsset,
  manageUsers,
  setDialogOpen,
  params
}) => {
  // const params = useParams() as unknown as CGAssetPageProps['params'];
  // const router = useRouter();
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(false);
  // const [pageNumber, setPageNumber] = useState(0);

  const { mediaDesc, medias, notFound } = getAssetMedias(cgAsset as CgAsset);

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

  const form = useForm<any>({
    resolver: zodResolver(ApplyDownloadBoxDeliverViewUserSchema),
    defaultValues
  });

  const appDLGlaciers = getAppDLGlaciers(cgAsset?.applyDownloads as ApplyDownload[]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="ダウンロード用 S3 Glacier 復元キュー通知内容" description={`アセットID: ${cgAsset?.asset_id} のS3 Glacier 復元キュー通知内容`} />
      </div>
      {/* <Separator /> */}
      <Form {...form}>
        <form className="space-y-8 w-full">
          <div className="maincon">
            <div className="applypage flex flex-row space-x-4">
              <div className="basis-1/3">
                <div className="flex flex-col space-y-4">
                  <div className="applypage__info rounded-lg border-2 border-slate-400/50 p-6">
                    <h2 className="applypage__title">申請先設定</h2>
                    <ul>
                      <li>
                        <FormField
                          control={form.control}
                          name="manage_user_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel><h3>番組責任者</h3></FormLabel>
                              <p>
                                {form.getValues('manageUser.name')}
                              </p>
                            </FormItem>
                          )}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="applypage__info rounded-lg border-2 border-slate-400/50 p-6">
                    <h2 className="applypage__title">ユーザ情報</h2>
                    <ul>
                      <li>
                        <h3>Oktaユーザ名</h3>
                        <p>{initialData?.applyUser?.name}</p>
                      </li>
                      <li>
                        <h3>メールアドレス</h3>
                        <p>{initialData?.applyUser?.email}</p>
                      </li>
                      <li>
                        <h3>主所属名</h3>
                        <p>{initialData?.applyUser?.registrantAffiliation?.desc}</p>
                      </li>
                      <li>
                        <h3>主所属コード</h3>
                        <p>{initialData?.applyUser?.regist_affili_code}</p>
                      </li>
                      <li>
                        <h3>CGアセットストアロール</h3>
                        <p>{initialData?.applyUser?.roleCGAssetStore?.desc}</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="basis-1/3">
                <div className="flex flex-col space-y-4">
                  <div className="applypage__info rounded-lg border-2 border-slate-400/50 p-6">
                    <h2 className="applypage__title">利用目的</h2>
                    <ul>
                      <li>
                        <FormField
                          control={form.control}
                          name="program_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel><h3>番組ID</h3></FormLabel>
                              <p>
                                {field.value}
                              </p>
                            </FormItem>
                          )}
                        />
                      </li>
                      <li>
                        <FormField
                          control={form.control}
                          name="program_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel><h3>番組名</h3></FormLabel>
                              <p>
                                {field.value}
                              </p>
                            </FormItem>
                          )}
                        />
                      </li>
                      <li>
                        <h3>利用期間</h3>
                        <p>
                          <FormField
                            control={form.control}
                            name="date_usage_start"
                            render={({ field }) => (
                              <FormItem className="inline">
                                {dateFormat(field.value, 'yyyy/MM/dd')}
                              </FormItem>
                            )}
                          />
                          &nbsp;-&nbsp;
                          <FormField
                            control={form.control}
                            name="date_usage_end"
                            render={({ field }) => (
                              <FormItem className="inline">
                                {dateFormat(field.value, 'yyyy/MM/dd')}
                              </FormItem>
                            )}
                          />
                        </p>
                      </li>
                      <li>
                        <FormField
                          control={form.control}
                          name="purpose_of_use_txt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel><h3>利用目的</h3></FormLabel>
                              <p>
                                {field.value && field.value.split("\n").map((item, index) => {
                                  return (
                                    <Fragment key={index}>{item}<br /></Fragment>
                                  );
                                })}
                              </p>
                            </FormItem>
                          )}
                        />
                      </li>
                      <li>
                        <FormField
                          control={form.control}
                          name="etc_txt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel><h3>その他</h3></FormLabel>
                              <p>
                                {field.value && field.value.split("\n").map((item, index) => {
                                  return (
                                    <Fragment key={index}>{item}<br /></Fragment>
                                  );
                                })}
                              </p>
                            </FormItem>
                          )}
                        />
                      </li>
                      {(!appDLGlaciers || appDLGlaciers?.length === 0) &&
                        <li>
                          <h3>ダウンロード</h3>
                          <p>
                            <div className="mx-auto my-2">
                              <Button
                                className="btn btn__download btn__download__expired"
                                type="button"
                                style={{ cursor: "default" }}
                              >
                                <X className="mr-4 h-8 w-8" /> DL対象ファイルなし
                              </Button>
                            </div>
                          </p>
                        </li>
                      }
                    </ul>
                  </div>
                  <div className="applypage__info rounded-lg border-2 border-slate-400/50 p-6">
                    <h2 className="applypage__title">ダウンロード</h2>
                    <ul>
                      {/* <FormField
              control={form.control}
              name="box_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boxリンク</FormLabel>
                  <div>
                    {field.value && (
                      <Link href={field.value} rel="noopener noreferrer" target="_blank">
                        {field.value}
                      </Link>
                    )}
                  </div>
                </FormItem>
              )}
            /> */}
                      {form.getValues('download_date') &&
                        <li>
                          <FormField
                            control={form.control}
                            name="download_date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel><h3>ダウンロード日</h3></FormLabel>
                                <p>
                                  {dateFormat(field.value, 'yyyy/MM/dd')}
                                </p>
                              </FormItem>
                            )}
                          />
                        </li>
                      }
                      <li>
                        <FormField
                          control={form.control}
                          name="removal_limit_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel><h3>データ削除期限</h3></FormLabel>
                              <p>
                                {dateFormat(field.value, 'yyyy/MM/dd')}
                              </p>
                            </FormItem>
                          )}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="basis-1/3">
                <div className="flex flex-col space-y-4">
                  <div className="applypage__info rounded-lg border-2 border-slate-400/50 p-6">
                    <h2 className="applypage__title">アセット情報</h2>
                    <div className="mainbox">
                      {medias ? (
                        <>
                          {/* <div style={{ width: "500", height: "276", position: "relative" }}> */}
                          <span className="mainbox__category">{mediaDesc}</span>
                          <Image
                            src={(medias && medias[0] ? medias[0].thumb_url as string : notFound)}
                            alt={cgAsset?.asset_id as string}
                            width={360}
                            height={203}
                            decoding="async"
                          />
                          {/* <p>{cgAsset?.asset_name}</p> */}
                          {/* <p style={{ position: "absolute", top: "9.3rem", left: "0.6rem", width: "19.0rem", textAlign: "right", zIndex: 40, color: "white", textShadow: "1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000", height: "2.0rem" }}>DL数:{elem.download_count}</p>
                      </div> */}
                        </>
                      ) : cgAsset?.asset_id}
                    </div>
                    <dl>
                      <dt>アセットID</dt>
                      <dd>{cgAsset?.asset_id ?? "--"}</dd>
                      <dt>アセット種別</dt>
                      <dd>{cgAsset?.assetCate?.desc ?? "--"}</dd>
                      <dt>ジャンル</dt>
                      <dd>{cgAsset?.asset_genre ?? "--"}</dd>
                      <dt>制作ソフトウェア</dt>
                      <dd>{cgAsset?.asset_app_prod ?? "--"}</dd>
                      <dt>形式</dt>
                      <dd>{cgAsset?.asset_format ?? "--"}</dd>
                      <dt>ファイルサイズ</dt>
                      <dd>{cgAsset?.asset_size ?? "--"}</dd>
                      <dt>レンダラ</dt>
                      <dd>{cgAsset?.asset_renderer ?? "--"}</dd>
                      <dt>番組ID</dt>
                      <dd>{cgAsset?.program_id ?? "--"}</dd>
                      <dt>番組名</dt>
                      <dd>{cgAsset?.program_name ?? "--"}</dd>
                      <dt>登録者所属</dt>
                      <dd>{cgAsset?.userCreate.registrantAffiliation?.desc ?? "--"}</dd>
                      <dt>公開範囲</dt>
                      <dd>{cgAsset?.sharedArea?.desc ?? "--"}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <div>
                <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
                  onClick={() => setDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" /> 閉じる
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

export default CGAssetApplyDownloadBoxDeliverViewUser
