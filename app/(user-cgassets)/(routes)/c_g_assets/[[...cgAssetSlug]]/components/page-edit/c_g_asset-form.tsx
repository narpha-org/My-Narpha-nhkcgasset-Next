"use client"

import * as z from "zod"
import { Fragment, useState } from "react"
// import Image from 'next/image'
// import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
// import { Undo2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
// import { format } from 'date-fns'
// import { dateFormat } from "@/lib/utils"

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
  CgAssetReview,
} from "@/graphql/generated/graphql";

// import { Input } from "@/components/ui/input-raw"
// import { Button } from "@/components/ui/button-raw"
import {
  Form,
  // FormControl,
  // FormDescription,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form-raw"
// import { Separator } from "@/components/ui/separator"
// import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
// import { Textarea } from "@/components/ui/text-area-raw"
import ImageUpload, { UploadImageProps } from "@/components/ui/image-upload-cgasset"
import FileUpload, { UploadFileProps } from "@/components/ui/file-upload-cgasset"
// import { Switch } from "@/components/ui/switch"
import { NavHeaderMypage } from '@/components/nav-header-mypage';
// import { cn } from '@/lib/utils';

import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"
// import CGAssetPreviewDialog from "./c_g_asset-preview-dialog"
import { CGAssetFormInput1 } from "./c_g_asset-form-input1"
import { CGAssetFormInput2 } from "./c_g_asset-form-input2"
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
      message: "権利使用条件は最大 500 文字以内でご入力ください。",
    }),
  asset_detail: z
    .string()
    .min(1, {
      message: "必須入力",
    })
    .max(1000, {
      message: "アセット詳細説明 は最大 1000 文字以内でご入力ください。",
    }),
  // assetTagsStr: z.string().optional(),
  assetTags: z.object({
    tag: z
      .string()
      .min(1, {
        message: "必須入力",
      })
      .max(200, {
        message: "タグ は最大 200 文字以内でご入力ください。",
      }),
    tag_add_edit_flg: z.boolean()
  }).array().optional(),
  reviews: z.object({
    id: z.string(),
    review: z.string(),
    valid_flg: z.boolean()
  }).array().optional(),
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
  // uploadDirId: z.string().optional(),
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
  submitFormInput: z.number().optional()
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
  const [pageNumber, setPageNumber] = useState(0);

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
    // assetTagsStr: initialData?.assetTags?.map((assetTag: CgAssetTag | null) => {
    //   return assetTag?.tag
    // }).join(','),
    assetTags: initialData?.assetTags as CgAssetTag[],
    reviews: initialData?.reviews as CgAssetReview[],
    // asset_media_base: initialData?.asset_media_base as string | undefined ?? "",
    // uploadDirId: initialData?.uploadDir?.id,
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
    // assetTagsStr: '',
    assetTags: [],
    reviews: [],
    // asset_media_base: '',
    // uploadDirId: '',
    // assetImages: [],
    // assetVideos: [],
    // asset3DCGs: [],
    assetUploads: [],
    assetThumbs: [],
    revision_history: '',
    valid_flg: true,
    submitFormInput: 0,
  }

  const form = useForm<CGAssetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // console.log(`CGAssetForm 1 form.getValues("assetTags"): ${JSON.stringify(form.getValues("assetTags"))}`);

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

        // console.log(`data.submitFormInput: ${data.submitFormInput}`);
        if (data.submitFormInput === 2) {
          onPrev();
        } else {
          // router.refresh();
          // router.prefetch(`/mypage`);
          router.push(`/c_g_assets/${params.cgAssetSlug[0]}`);
        }

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

        // console.log(`data.submitFormInput: ${data.submitFormInput}`);
        if (data.submitFormInput === 2) {
          onPrev();
        } else {
          // router.refresh();
          // router.prefetch(`/mypage`);
          router.push(`/c_g_assets/${newCgAssetId}`);
        }

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
      router.push(`/`);
      toast.success('CGアセットが削除されました。');
    } catch (error: any) {
      toast.error('CGアセットの削除に失敗しました。');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  const onNext = () => {
    // console.log(`onNext form.getValues("assetTags"): ${JSON.stringify(form.getValues("assetTags"))}`);
    setPageNumber(state => state + 1);
  };

  const onPrev = () => {
    // console.log(`onPrev form.getValues("assetTags"): ${JSON.stringify(form.getValues("assetTags"))}`);
    setPageNumber(state => state - 1);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <NavHeaderMypage />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          {pageNumber === 0 && <CGAssetFormInput1
            form={form}
            cgAsset={initialData}
            assetCates={assetCates}
            registrantAffiliations={registrantAffiliations}
            viewingRestrictions={viewingRestrictions}
            broadcastingRights={broadcastingRights}
            sharedAreas={sharedAreas}
            uploadDirs={uploadDirs}
            params={params}
            loading={loading}
            onNext={onNext}
            onSubmit={onSubmit}
          />}
          {pageNumber === 1 && <CGAssetFormInput2
            form={form}
            cgAsset={initialData}
            assetCates={assetCates}
            registrantAffiliations={registrantAffiliations}
            viewingRestrictions={viewingRestrictions}
            broadcastingRights={broadcastingRights}
            sharedAreas={sharedAreas}
            uploadDirs={uploadDirs}
            params={params}
            loading={loading}
            onPrev={onPrev}
            onSubmit={onSubmit}
          />}
        </form>
      </Form >
    </>
  );
};
