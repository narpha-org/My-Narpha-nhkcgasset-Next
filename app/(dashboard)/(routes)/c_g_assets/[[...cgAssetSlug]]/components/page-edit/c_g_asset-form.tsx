"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash, Undo2, Save, Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgAsset,
  CgAssetCate,
  CgaRegistrantAffiliation,
  CgaViewingRestriction,
  CgaBroadcastingRight,
  CgaSharedArea,
  CgAssetTag,
  // CgAssetImage,
  // CgAssetVideo,
  // CgAsset3Dcg,
  CreateCgAssetDocument,
  UpdateCgAssetDocument,
  DeleteCgAssetDocument,
} from "@/graphql/generated/graphql";

import { Input } from "@/components/ui/input"
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
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/text-area"
import ImageUpload, { UploadImageProps } from "@/components/ui/image-upload"
import FileUpload, { UploadFileProps } from "@/components/ui/file-upload"
import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"

const formSchema = z.object({
  asset_id: z.string().min(1, {
    message: "必須入力",
  }),
  assetCateId: z.string().min(1, {
    message: "必須選択",
  }),
  asset_app_prod: z.string().min(0),
  asset_format: z.string().min(0),
  asset_size: z.string().min(0),
  asset_renderer: z.string().min(0),
  program_id: z.string().min(0),
  program_name: z.string().min(0),
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
    .max(200, {
      message: "権利補足（使用上の注意）は最大 200 文字以内でご入力ください。",
    }),
  asset_detail: z
    .string()
    .min(1, {
      message: "必須入力",
    })
    .max(200, {
      message: "アセット詳細説明 は最大 200 文字以内でご入力ください。",
    }),
  assetTagsStr: z.string().min(0),
  asset_media_base: z
    .string()
    .min(1, {
      message: "必須入力",
    })
    .max(1000, {
      message: "アップロード場所 は最大 1000 文字以内でご入力ください。",
    })
    .regex(/^[^/].+[^/]$/, {
      message: "アップロード場所 は最初と最後に / は使用できません。",
    }),
  assetImages: z.object({
    file_name: z.string(),
    url: z.string(),
    file_path: z.string(),
    thumb_file_name: z.string(),
    thumb_url: z.string(),
    thumb_file_path: z.string()
  }).array(),
  assetVideos: z.object({
    file_name: z.string(),
    url: z.string(),
    file_path: z.string(),
    thumb_file_name: z.string().min(0),
    thumb_url: z.string().min(0),
    thumb_file_path: z.string().min(0)
  }).array(),
  asset3DCGs: z.object({
    file_name: z.string(),
    url: z.string(),
    file_path: z.string(),
    thumb_file_name: z.string().min(0),
    thumb_url: z.string().min(0),
    thumb_file_path: z.string().min(0)
  }).array(),
  valid_flg: z.boolean().default(true).optional(),
});

type CGAssetFormValues = z.infer<typeof formSchema>

interface CGAssetFormProps {
  initialData: CgAsset | null;
  assetCates: CgAssetCate[];
  registrantAffiliations: CgaRegistrantAffiliation[];
  viewingRestrictions: CgaViewingRestriction[];
  broadcastingRights: CgaBroadcastingRight[];
  sharedAreas: CgaSharedArea[];
};

export const CGAssetForm: React.FC<CGAssetFormProps> = ({
  initialData,
  assetCates,
  registrantAffiliations,
  viewingRestrictions,
  broadcastingRights,
  sharedAreas,
}) => {
  const params = useParams() as unknown as CGAssetPageProps['params'];
  const router = useRouter();
  const { data: session, status } = useSession()

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'CGアセット 編集' : 'CGアセット 新規追加';
  const description = initialData ? '指定CGアセットの編集' : '新規CGアセットの追加';
  const toastMessage = initialData ? 'CGアセットが更新されました。' : 'CGアセットが新規追加されました。';
  const action = initialData ? '更新' : '追加';

  const defaultValues = initialData ? {
    ...initialData,
    assetCateId: initialData?.assetCate?.id,
    asset_app_prod: initialData?.asset_app_prod as string | undefined,
    asset_format: initialData?.asset_format as string | undefined,
    asset_size: initialData?.asset_size as string | undefined,
    asset_renderer: initialData?.asset_renderer as string | undefined,
    program_id: initialData?.program_id as string | undefined,
    program_name: initialData?.program_name as string | undefined,
    registrantAffiliationId: initialData?.registrantAffiliation?.id,
    viewingRestrictionId: initialData?.viewingRestriction?.id,
    broadcastingRightId: initialData?.broadcastingRight?.id,
    sharedAreaId: initialData?.sharedArea?.id,
    rights_supplement: initialData?.rights_supplement as string | undefined,
    asset_detail: initialData?.asset_detail as string | undefined,
    assetTagsStr: initialData?.assetTags?.map((assetTag: CgAssetTag | null) => {
      return assetTag?.tag
    }).join(','),
    asset_media_base: initialData?.asset_media_base as string | undefined,
    assetImages: initialData?.assetImages as UploadImageProps[],
    assetVideos: initialData?.assetVideos as UploadImageProps[],
    asset3DCGs: initialData?.asset3DCGs as UploadFileProps[]
  } : {
    asset_id: '',
    assetCateId: '',
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
    asset_media_base: '',
    assetImages: [],
    assetVideos: [],
    asset3DCGs: [],
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

      if (initialData) {
        await apolloClient
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

        router.refresh();
        router.push(`/c_g_assets/${params.cgAssetSlug[0]}`);

      } else {
        const ret: FetchResult<{
          createCGAsset: CgAsset;
        }> = await apolloClient
          .mutate({
            mutation: CreateCgAssetDocument,
            variables: {
              input: {
                create_user_id: (session?.user as { userId: string }).userId,
                ...data,
                ...additionalData
              }
            },
          });
        const newCgAssetId = ret.data?.createCGAsset.id;

        router.refresh();
        router.push(`/c_g_assets/${newCgAssetId}`);
      }
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('CGアセットの保存に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await apolloClient
        .mutate({
          mutation: DeleteCgAssetDocument,
          variables: {
            id: params.cgAssetSlug[0],
          },
        })
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
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="asset_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>アセットID</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="#000012" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assetCateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>アセット種別</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="アセット種別を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assetCates && assetCates.map((assetCate) => (
                        <SelectItem key={assetCate.id} value={assetCate.id}>{assetCate.desc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="asset_app_prod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>制作アプリ</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Maya 2022" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="asset_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>形式</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="MayaBinary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="asset_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>サイズ</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="235MB" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="asset_renderer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>レンダラ</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Arnold" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>番組ID</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="2300-456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="program_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>番組名</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nスペ「恐竜」" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registrantAffiliationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>登録者所属</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="登録者所属を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {registrantAffiliations && registrantAffiliations.map((registrantAffiliation) => (
                        <SelectItem key={registrantAffiliation.id} value={registrantAffiliation.id}>{registrantAffiliation.desc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="viewingRestrictionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>閲覧制限</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="閲覧制限を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {viewingRestrictions && viewingRestrictions.map((viewingRestriction) => (
                        <SelectItem key={viewingRestriction.id} value={viewingRestriction.id}>{viewingRestriction.desc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="broadcastingRightId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>放送権利</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="放送権利を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {broadcastingRights && broadcastingRights.map((broadcastingRight) => (
                        <SelectItem key={broadcastingRight.id} value={broadcastingRight.id}>{broadcastingRight.desc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sharedAreaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>公開エリア</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="公開エリアを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sharedAreas && sharedAreas.map((sharedArea) => (
                        <SelectItem key={sharedArea.id} value={sharedArea.id}>{sharedArea.desc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rights_supplement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>権利補足（使用上の注意）</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="権利補足（使用上の注意）"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="asset_detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>アセット詳細説明</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="アセット詳細説明"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assetTagsStr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タグ</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="aaa,bbb,ccc"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="asset_media_base"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>アップロード場所</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="3DModels/乗り物/飛行機" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assetImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>アセット画像</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value as UploadImageProps[]}
                      disabled={loading}
                      onChange={({
                        file_name,
                        url,
                        file_path,
                        thumb_file_name,
                        thumb_url,
                        thumb_file_path
                      }) => field.onChange([...field.value, {
                        file_name,
                        url,
                        file_path,
                        thumb_file_name,
                        thumb_url,
                        thumb_file_path
                      }])}
                      onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assetVideos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>アセット動画</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value as UploadFileProps[]}
                      disabled={loading}
                      onChange={({
                        file_name,
                        url,
                        file_path,
                        thumb_file_name,
                        thumb_url,
                        thumb_file_path
                      }) => field.onChange([...field.value, {
                        file_name,
                        url,
                        file_path,
                        thumb_file_name,
                        thumb_url,
                        thumb_file_path
                      }])}
                      onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                      poster="/images/asset_video.png"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="asset3DCGs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>アセット3DCG</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value as UploadFileProps[]}
                      disabled={loading}
                      onChange={({
                        file_name,
                        url,
                        file_path,
                        thumb_file_name,
                        thumb_url,
                        thumb_file_path
                      }) => field.onChange([...field.value, {
                        file_name,
                        url,
                        file_path,
                        thumb_file_name,
                        thumb_url,
                        thumb_file_path
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
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="valid_flg"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      disabled={loading}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      有効フラグ
                    </FormLabel>
                    <FormDescription>
                      このCGアセットを絞り込み結果に表示する
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => router.push(`/c_g_assets${(
              params.cgAssetSlug[0] !== CGAssetPageSlug.New ?
                "/" + params.cgAssetSlug[0] :
                ""
            )}`)}>
            <Undo2 className="mr-2 h-4 w-4" /> キャンセル
          </Button>
          <Button disabled={loading} className="ml-auto" type="submit">
            {initialData ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />} {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
