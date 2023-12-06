"use client"

import * as z from "zod"
import { Fragment, useState } from "react"
// import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Undo2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { format } from 'date-fns'
import { dateFormat } from "@/lib/utils"

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CreateCgAssetMutation,
  CreateCgAssetDocument,
  UpdateCgAssetMutation,
  UpdateCgAssetDocument,
  DeleteCgAssetMutation,
  DeleteCgAssetDocument,
  CgAsset,
  CgAssetCate,
  CgaRegistrantAffiliation,
  CgaViewingRestriction,
  CgaBroadcastingRight,
  CgaSharedArea,
  CgAssetTag,
  CgAssetUploadDir,
  CgaRevisionHistory,
} from "@/graphql/generated/graphql";

import { Input } from "@/components/ui/input-raw"
import { Button } from "@/components/ui/button-raw"
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form-raw"
// import { Separator } from "@/components/ui/separator"
// import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Textarea } from "@/components/ui/text-area-raw"
import ImageUpload, { UploadImageProps } from "@/components/ui/image-upload-cgasset"
import FileUpload, { UploadFileProps } from "@/components/ui/file-upload-cgasset"
// import { Switch } from "@/components/ui/switch"
import { NavHeaderMypage } from '@/components/nav-header-mypage';
import { cn } from '@/lib/utils';

import { CGAssetPageProps, CGAssetPageSlug } from "../../../../components/page-slug"
import CGAssetPreviewDialog from "./c_g_asset-preview-dialog"
// import AssetRevisionHistoryBlock from "../page-detail/asset-revision-history-block"

const formSchema = z.object({
  asset_id: z.string().min(1, {
    message: "必須入力",
  }),
  asset_name: z.string().min(1, {
    message: "必須入力",
  }),
  assetCateId: z.string().min(1, {
    message: "必須選択",
  }),
  asset_genre: z.string().optional(),
  asset_app_prod: z.string().optional(),
  asset_format: z.string().optional(),
  asset_size: z.string().optional(),
  asset_renderer: z.string().optional(),
  program_id: z.string().optional(),
  program_name: z.string().optional(),
  registrantAffiliationId: z.string().min(1, {
    message: "必須選択",
  }),
  viewingRestrictionId: z.string().min(1, {
    message: "必須選択",
  }),
  broadcastingRightId: z.string().min(1, {
    message: "必須選択",
  }),
  sharedAreaId: z.string().min(1, {
    message: "必須選択",
  }),
  rights_supplement: z
    .string()
    .min(1, {
      message: "必須入力",
    })
    .max(500, {
      message: "権利補足（使用上の注意）は最大 500 文字以内でご入力ください。",
    }),
  asset_detail: z
    .string()
    .min(1, {
      message: "必須入力",
    })
    .max(1000, {
      message: "アセット詳細説明 は最大 1000 文字以内でご入力ください。",
    }),
  assetTagsStr: z.string().optional(),
  // asset_media_base: z
  //   .string()
  //   .min(1, {
  //     message: "必須入力",
  //   })
  //   .max(1000, {
  //     message: "アップロード場所 は最大 1000 文字以内でご入力ください。",
  //   })
  //   .regex(/^[^/].+[^/]$/, {
  //     message: "アップロード場所 は最初と最後に / は使用できません。",
  //   }),
  uploadDirId: z.string().min(1, {
    message: "必須選択",
  }),
  // assetImages: z.object({
  //   file_name: z.string(),
  //   url: z.string(),
  //   file_path: z.string(),
  //   thumb_file_name: z.string(),
  //   thumb_url: z.string(),
  //   thumb_file_path: z.string()
  // }).array(),
  // assetVideos: z.object({
  //   file_name: z.string(),
  //   url: z.string(),
  //   file_path: z.string(),
  //   thumb_file_name: z.string().optional(),
  //   thumb_url: z.string().optional(),
  //   thumb_file_path: z.string().optional()
  // }).array(),
  // asset3DCGs: z.object({
  //   file_name: z.string(),
  //   url: z.string(),
  //   file_path: z.string(),
  //   thumb_file_name: z.string().optional(),
  //   thumb_url: z.string().optional(),
  //   thumb_file_path: z.string().optional()
  // }).array(),
  assetUploads: z.object({
    file_name: z.string(),
    url: z.string().nullable(),
    file_path: z.string()
  }).array(),
  assetThumbs: z.object({
    thumb_file_name: z.string(),
    thumb_url: z.string().nullable(),
    thumb_file_path: z.string()
  }).array(),
  revision_history: z.string().optional(),
  valid_flg: z.boolean().default(true).optional(),
  updated_at: z.date().optional(),
});

type CGAssetFormValues = z.infer<typeof formSchema>

interface CGAssetFormProps {
  initialData: CgAsset | null;
  assetCates: CgAssetCate[];
  registrantAffiliations: CgaRegistrantAffiliation[];
  viewingRestrictions: CgaViewingRestriction[];
  broadcastingRights: CgaBroadcastingRight[];
  sharedAreas: CgaSharedArea[];
  uploadDirs: CgAssetUploadDir[];
};

export const CGAssetForm: React.FC<CGAssetFormProps> = ({
  initialData,
  assetCates,
  registrantAffiliations,
  viewingRestrictions,
  broadcastingRights,
  sharedAreas,
  uploadDirs
}) => {
  const params = useParams() as unknown as CGAssetPageProps['params'];
  const router = useRouter();
  const { data: session, status } = useSession()

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'CGアセット 編集' : 'CGアセット 新規追加';
  const description = initialData ? '指定CGアセットの編集' : '新規CGアセットの追加';
  const toastMessage = initialData ? 'CGアセットが更新されました。' : 'CGアセットが新規追加されました。';
  const action = initialData ? '保存' : '追加';

  const defaultValues = initialData ? {
    ...initialData,
    assetCateId: initialData?.assetCate?.id,
    asset_genre: initialData?.asset_genre as string | undefined ?? "",
    asset_app_prod: initialData?.asset_app_prod as string | undefined ?? "",
    asset_format: initialData?.asset_format as string | undefined ?? "",
    asset_size: initialData?.asset_size as string | undefined ?? "",
    asset_renderer: initialData?.asset_renderer as string | undefined ?? "",
    program_id: initialData?.program_id as string | undefined ?? "",
    program_name: initialData?.program_name as string | undefined ?? "",
    registrantAffiliationId: initialData?.registrantAffiliation?.id,
    viewingRestrictionId: initialData?.viewingRestriction?.id,
    broadcastingRightId: initialData?.broadcastingRight?.id,
    sharedAreaId: initialData?.sharedArea?.id,
    rights_supplement: initialData?.rights_supplement as string | undefined ?? "",
    asset_detail: initialData?.asset_detail as string | undefined ?? "",
    assetTagsStr: initialData?.assetTags?.map((assetTag: CgAssetTag | null) => {
      return assetTag?.tag
    }).join(','),
    // asset_media_base: initialData?.asset_media_base as string | undefined ?? "",
    uploadDirId: initialData?.uploadDir?.id,
    // assetImages: initialData?.assetImages as UploadImageProps[],
    // assetVideos: initialData?.assetVideos as UploadImageProps[],
    // asset3DCGs: initialData?.asset3DCGs as UploadFileProps[],
    assetUploads: initialData?.assetUploads as UploadFileProps[],
    assetThumbs: initialData?.assetThumbs as UploadImageProps[],
    updated_at: initialData?.updated_at ? new Date(initialData.updated_at) : undefined,
  } : {
    asset_id: '（自動採番）',
    asset_name: '',
    assetCateId: '',
    asset_genre: '',
    asset_app_prod: '',
    asset_format: '',
    asset_size: '',
    asset_renderer: '',
    program_id: '',
    program_name: '',
    registrantAffiliationId: '',
    viewingRestrictionId: '',
    broadcastingRightId: '',
    sharedAreaId: '',
    rights_supplement: '',
    asset_detail: '',
    assetTagsStr: '',
    // asset_media_base: '',
    uploadDirId: '',
    // assetImages: [],
    // assetVideos: [],
    // asset3DCGs: [],
    assetUploads: [],
    assetThumbs: [],
    revision_history: '',
    valid_flg: true,
  }

  const form = useForm<CGAssetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: CGAssetFormValues) => {
    try {
      setLoading(true);

      const additionalData = {}
      delete (data.updated_at);

      if (initialData) {
        const ret: FetchResult<UpdateCgAssetMutation>
          = await apolloClient
            .mutate({
              mutation: UpdateCgAssetDocument,
              variables: {
                input: {
                  id: params.cgAssetSlug[0],
                  update_user_id: (session?.user as { userId: string }).userId,
                  ...data,
                  ...additionalData
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

        // router.refresh();
        // router.prefetch(`/`);
        router.push(`/c_g_assets/${params.cgAssetSlug[0]}`);

      } else {
        const ret: FetchResult<CreateCgAssetMutation>
          = await apolloClient
            .mutate({
              mutation: CreateCgAssetDocument,
              variables: {
                input: {
                  create_user_id: (session?.user as { userId: string }).userId,
                  ...data,
                  ...additionalData,
                  asset_id: '_DUMMY_',
                }
              },
            });
        const newCgAssetId = ret.data?.createCGAsset?.id;

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

        // router.refresh();
        // router.prefetch(`/`);
        router.push(`/c_g_assets/${newCgAssetId}`);
      }
      toast.success(toastMessage);
    } catch (error: any) {
      console.log(`err: ${JSON.stringify(error)}`);
      toast.error('CGアセットの保存に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      const ret: FetchResult<DeleteCgAssetMutation>
        = await apolloClient
          .mutate({
            mutation: DeleteCgAssetDocument,
            variables: {
              id: params.cgAssetSlug[0],
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
      router.push(`/c_g_assets`);
      toast.success('CGアセットが削除されました。');
    } catch (error: any) {
      toast.error('CGアセットの削除に失敗しました。');
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
      <NavHeaderMypage />

      {/* <!-- main --> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <main className="maincon">
            <div className="registration">
              <div className="registration__inner">
                <div className="registration__mainbox">
                  <div className="registration__title">
                    <h2>アセットタイトル</h2>
                    <FormField
                      control={form.control}
                      name="asset_name"
                      render={({ field }) => (
                        <FormItem
                          style={{
                            width: '45vw'
                          }}
                        >
                          <Input
                            id="assets-title"
                            htmlName="assets-title"
                            disabled={loading}
                            placeholder="SHIELD_Quinjet"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="">
                      <CGAssetPreviewDialog
                        form={form}
                        disabled={loading}
                        assetCates={assetCates}
                        registrantAffiliations={registrantAffiliations}
                        viewingRestrictions={viewingRestrictions}
                        broadcastingRights={broadcastingRights}
                        sharedAreas={sharedAreas}
                        uploadDirs={uploadDirs}
                      />
                    </div>
                  </div>
                  <div className="registration__maincon">
                    <div className="registration__maincon-left">
                      <h2>アセットタイトル</h2>
                      <dl>
                        <dt>アセットID</dt>
                        <dd>
                          <p className="asset-id">
                            <FormField
                              control={form.control}
                              name="asset_id"
                              render={({ field }) => (
                                <Input
                                  disabled={true}
                                  placeholder="（自動採番）"
                                  {...field}
                                />
                              )}
                            />
                          </p>
                        </dd>
                        <dt>アセット種別</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="assetCateId"
                            render={({ field }) => (
                              <FormItem>
                                <select
                                  name="assets__type"
                                  className="assets-pulldown"
                                  disabled={loading}
                                  onChange={field.onChange}
                                  value={field.value}
                                  defaultValue={field.value}
                                >
                                  <option hidden className="first"></option>
                                  {assetCates && assetCates.map((assetCate) => (
                                    <option
                                      key={assetCate.id}
                                      value={assetCate.id}
                                      selected={field.value === assetCate.id ? true : false}
                                    >
                                      {assetCate.desc}
                                    </option>
                                  ))}
                                </select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                        <dt>ジャンル</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="asset_genre"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  id="assets-input01"
                                  htmlName="assets__genre"
                                  className="assets-input"
                                  disabled={loading}
                                  placeholder="都市、ビル"
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                        <dt>制作ソフトウェア</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="asset_app_prod"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  id="assets-input02"
                                  htmlName="assets__soft"
                                  className="assets-input"
                                  disabled={loading}
                                  placeholder="Maya 2022"
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                        <dt>形式</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="asset_format"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  id="assets-input03"
                                  htmlName="assets__format"
                                  className="assets-input"
                                  disabled={loading}
                                  placeholder="MayaBinary"
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                        <dt>ファイルサイズ</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="asset_size"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  id="assets-input04"
                                  htmlName="assets__size"
                                  className="assets-input"
                                  disabled={loading}
                                  placeholder="235MB"
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                        <dt>レンダラ</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="asset_renderer"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  id="assets-input05"
                                  htmlName="assets__renderer"
                                  className="assets-input"
                                  disabled={loading}
                                  placeholder="Arnold"
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                        <dt>番組ID</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="program_id"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  id="assets-input06"
                                  htmlName="assets__program-id"
                                  className="assets-input"
                                  disabled={loading}
                                  placeholder="2300-456"
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                        <dt>番組名</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="program_name"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  id="assets-input07"
                                  htmlName="assets__program-name"
                                  className="assets-input"
                                  disabled={loading}
                                  placeholder="Nスペ「恐竜」"
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                        <dt>登録者所属</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="registrantAffiliationId"
                            render={({ field }) => (
                              <FormItem>
                                <select
                                  name="assets__affiliation"
                                  className="assets-pulldown"
                                  disabled={loading}
                                  onChange={field.onChange}
                                  value={field.value}
                                  defaultValue={field.value}
                                >
                                  <option hidden className="first"></option>
                                  {registrantAffiliations && registrantAffiliations.map((registrantAffiliation) => (
                                    <option
                                      key={registrantAffiliation.id}
                                      value={registrantAffiliation.id}
                                      selected={field.value === registrantAffiliation.id ? true : false}
                                    >
                                      {registrantAffiliation.desc}
                                    </option>
                                  ))}
                                </select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                        <dt>公開</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="sharedAreaId"
                            render={({ field }) => (
                              <FormItem>
                                <div className="radio_box">
                                  {sharedAreas && sharedAreas.map((sharedArea) => (
                                    <label key={sharedArea.id}>
                                      <input
                                        type="radio"
                                        name="release"
                                        disabled={loading}
                                        onChange={field.onChange}
                                        value={sharedArea.id}
                                        checked={field.value === sharedArea.id ? true : false}
                                      />
                                      {sharedArea.desc}
                                    </label>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* <div className="radio_box">
                            <label><input type="radio" name="release" />一般公開可</label>
                            <label><input type="radio" name="release" />一般公開不可</label>
                          </div> */}
                        </dd>
                        <dt>観覧権限</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="viewingRestrictionId"
                            render={({ field }) => (
                              <FormItem>
                                <div className="radio_box">
                                  {viewingRestrictions && viewingRestrictions.map((viewingRestriction) => (
                                    <label key={viewingRestriction.id}>
                                      <input
                                        type="radio"
                                        name="privileges"
                                        disabled={loading}
                                        onChange={field.onChange}
                                        value={viewingRestriction.id}
                                        checked={field.value === viewingRestriction.id ? true : false}
                                      />
                                      {viewingRestriction.desc}
                                    </label>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* <div className="radio_box">
                            <label><input type="radio" name="privileges" />制限なし</label>
                            <label><input type="radio" name="privileges" />グループのみ</label>
                            <label><input type="radio" name="privileges" />登録者のみ</label>
                          </div> */}
                        </dd>
                        <dt>放送権利</dt>
                        <dd>
                          <FormField
                            control={form.control}
                            name="broadcastingRightId"
                            render={({ field }) => (
                              <FormItem>
                                <select
                                  name="assets__affiliation"
                                  className="assets-pulldown"
                                  disabled={loading}
                                  onChange={field.onChange}
                                  value={field.value}
                                  defaultValue={field.value}
                                >
                                  <option hidden className="first"></option>
                                  {broadcastingRights && broadcastingRights.map((broadcastingRight) => (
                                    <option
                                      key={broadcastingRight.id}
                                      value={broadcastingRight.id}
                                      selected={field.value === broadcastingRight.id ? true : false}
                                    >
                                      {broadcastingRight.desc}
                                    </option>
                                  ))}
                                </select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                        <dt className="areamax">権利使用条件</dt>
                        <dd className="areamax">
                          <FormField
                            control={form.control}
                            name="rights_supplement"
                            render={({ field }) => (
                              <FormItem>
                                <Textarea
                                  id="conditions"
                                  htmlName="conditions"
                                  rows={5}
                                  // cols={33}
                                  className="assets-textarea"
                                  disabled={loading}
                                  placeholder="権利補足（使用上の注意）"
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                        <dt className="areamax">アセット詳細説明</dt>
                        <dd className="areamax">
                          <FormField
                            control={form.control}
                            name="asset_detail"
                            render={({ field }) => (
                              <FormItem>
                                <Textarea
                                  id="explanation"
                                  htmlName="explanation"
                                  rows={5}
                                  // cols={33}
                                  className="assets-textarea"
                                  disabled={loading}
                                  placeholder="アセット詳細説明"
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </dd>
                      </dl>
                    </div>
                    <div className="registration__maincon-right">
                      <div className="registration__maincon-upload">
                        <FormField
                          control={form.control}
                          name="assetUploads"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FileUpload
                                  glacier={false}
                                  value={field.value as UploadFileProps[]}
                                  disabled={loading}
                                  onChange={({
                                    file_name,
                                    url,
                                    file_path
                                  }) => field.onChange([...field.value, {
                                    file_name,
                                    url,
                                    file_path
                                  }])}
                                  onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                  poster="/images/asset_3dcg.png"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="registration__maincon-tumb">
                        <FormField
                          control={form.control}
                          name="assetThumbs"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <ImageUpload
                                  glacier={false}
                                  value={field.value as UploadImageProps[]}
                                  disabled={loading}
                                  onChange={({
                                    thumb_file_name,
                                    thumb_url,
                                    thumb_file_path
                                  }) => field.onChange([...field.value, {
                                    thumb_file_name,
                                    thumb_url,
                                    thumb_file_path
                                  }])}
                                  onRemove={(thumb_url) => field.onChange([...field.value.filter((current) => current.thumb_url !== thumb_url)])}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="registration__maincon-tag">
                        <h2>アップロード場所</h2>
                        <FormField
                          control={form.control}
                          name="uploadDirId"
                          render={({ field }) => (
                            <FormItem>
                              <select
                                name="assets__uploaddir"
                                className="my-assets-pulldown-upload-dir"
                                disabled={loading}
                                onChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                                placeholder="アップロード場所を選択"
                              >
                                <option hidden className="first"></option>
                                {uploadDirs && uploadDirs.map((uploadDir) => (
                                  <option
                                    key={uploadDir.id}
                                    value={uploadDir.id}
                                    selected={field.value === uploadDir.id ? true : false}
                                  >
                                    {uploadDir.base_path}
                                  </option>
                                ))}
                              </select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="registration__maincon-tag">
                        <h2>タグ</h2>
                        <div className="">
                          <FormField
                            control={form.control}
                            name="assetTagsStr"
                            render={({ field }) => (
                              <FormItem
                                style={{ width: '100%' }}
                              >
                                <Textarea
                                  disabled={loading}
                                  placeholder="aaa,bbb,ccc"
                                  className="my-assets-textarea-tags"
                                  rows={3}
                                  // cols={33}
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {/* <div className="tag_list">
                          <button id="tag_gray-btn01" type="submit"
                            className="tag_gray">タグ</button>
                          <button id="tag_gray-btn02" type="submit"
                            className="tag_gray">テキストテキスト</button>
                          <button id="tag_gray-btn03" type="submit"
                            className="tag_gray">テキスト</button>
                        </div> */}
                      </div>

                    </div>

                  </div>
                </div>
                <div className="registration__side">
                  <div className="registration__sidestatus">
                    <div className="registration__sidestatus-con">
                      <h2>公開ステータス</h2>
                      <div className="keepbox">
                        <button
                          id="dl-btn02"
                          type="submit"
                          className={cn(
                            'btn',
                            loading && 'opacity-50'
                          )}
                          style={loading ? { cursor: 'default' } : { cursor: 'pointer' }}
                        >保存</button>
                        <FormField
                          control={form.control}
                          name="updated_at"
                          render={({ field }) => (
                            <FormItem>
                              {field.value && (
                                <p>
                                  {format(new Date(field.value), "yyyy.MM.dd")}
                                </p>
                              )}
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="togglebox">
                        <p>公開</p>

                        <div className={cn(
                          'toggle_button',
                          loading && 'opacity-50'
                        )}>
                          <FormField
                            control={form.control}
                            name="valid_flg"
                            render={({ field }) => (
                              <input
                                id="toggle"
                                className="toggle_input"
                                type='checkbox'
                                checked={field.value}
                                onChange={field.onChange}
                                disabled={loading}
                                style={loading ? { cursor: 'default' } : { cursor: 'pointer' }}
                              />
                            )}
                          />
                          <label htmlFor="toggle" className="toggle_label" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="registration__sidelog">
                    <h2>更新ログ</h2>
                    <ul className="detail__sideloglist">
                      {initialData?.revisionHistories && initialData.revisionHistories?.map((elem: CgaRevisionHistory | null) => {

                        if (elem) {
                          return <li key={elem.id} className="flex flex-wrap justify-between mb-5">
                            <span>{dateFormat(elem.created_at, 'yyyy.MM.dd')}</span>
                            <p>{elem.desc.split("\n").map((item, index) => {
                              return (
                                <Fragment key={index}>{item}<br /></Fragment>
                              );
                            })}</p>
                            {/* <p>{elem.revisedUser?.name}</p> */}
                          </li>
                        }
                      })}
                    </ul>
                  </div>
                  <div className="registration__sidelog">
                    <h2>更新ログ記入</h2>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="revision_history"
                        render={({ field }) => (
                          <FormItem
                            style={{ width: '100%' }}
                          >
                            <FormControl>
                              <Textarea
                                disabled={loading}
                                placeholder="修正した内容を記述"
                                className="my-assets-textarea-log"
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="registration__sidelog">
                    <Button
                      disabled={loading}
                      className={cn(
                        'flex flex-row m-auto',
                        loading && 'opacity-50'
                      )}
                      style={loading ? { cursor: 'default' } : { cursor: 'pointer' }}
                      type="button"
                      onClick={() => router.push(`/${(
                        params.cgAssetSlug[0] !== CGAssetPageSlug.New ?
                          "c_g_assets/" + params.cgAssetSlug[0] :
                          ""
                      )}`)}
                    >
                      <Undo2 className="mr-2 h-4 w-4" /> {action}しないで終了
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </form>
      </Form >
    </>
  );
};
