"use client"

import { Fragment, Dispatch, SetStateAction } from "react";
// import { useParams, useRouter } from "next/navigation"
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { X, Send } from "lucide-react"
import { format } from 'date-fns'

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
import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"

interface CGAssetApplyDownloadRemovalFormConfirmProps {
  form: UseFormReturn<any>;
  initialData: ApplyDownload | null;
  cgAsset: CgAsset | null;
  manageUsers: User[] | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    cgAssetSlug: string[];
  };
  loading: boolean;
  onPrev: () => void;
};

export const CGAssetApplyDownloadRemovalFormConfirm: React.FC<CGAssetApplyDownloadRemovalFormConfirmProps> = ({
  form,
  initialData,
  cgAsset,
  manageUsers,
  setDialogOpen,
  params,
  loading,
  onPrev,
}) => {
  // const params = useParams() as unknown as CGAssetPageProps['params'];
  // const router = useRouter();

  return (
    <>
      <div className="md:grid md:grid-cols-3 gap-8">
        <FormField
          control={form.control}
          name="manage_user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>番組責任者</FormLabel>
              <div>
                {form.getValues('manageUser.name')}
              </div>
            </FormItem>
          )}
        />
      </div>
      <div className="md:grid md:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="program_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>番組ID</FormLabel>
              <div>
                {field.value}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="program_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>番組名</FormLabel>
              <div>
                {field.value}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_usage_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>利用期間・開始</FormLabel>
              <div>
                {format(new Date(field.value), "yyyy/MM/dd")}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_usage_end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>利用期間・終了</FormLabel>
              <div>
                {format(new Date(field.value), "yyyy/MM/dd")}
              </div>
            </FormItem>
          )}
        />
      </div>
      <div className="md:grid md:grid-cols-3 gap-8">
        <FormField
          control={form.control}
          name="purpose_of_use_txt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>利用目的</FormLabel>
              <div>
                {field.value.split("\n").map((item, index) => {
                  return (
                    <Fragment key={index}>{item}<br /></Fragment>
                  );
                })}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="etc_txt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>その他</FormLabel>
              <div>
                {field.value.split("\n").map((item, index) => {
                  return (
                    <Fragment key={index}>{item}<br /></Fragment>
                  );
                })}
              </div>
            </FormItem>
          )}
        />
        <FormField
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
        />
        <FormField
          control={form.control}
          name="download_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ダウンロード日</FormLabel>
              <div>
                {format(new Date(field.value), "yyyy/MM/dd")}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="removal_limit_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>データ削除期限</FormLabel>
              <div>
                {format(new Date(field.value), "yyyy/MM/dd")}
              </div>
            </FormItem>
          )}
        />
      </div>
      <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
        onClick={() => setDialogOpen(false)}>
        <X className="mr-2 h-4 w-4" /> 閉じる
      </Button>
      <Button disabled={loading} className="ml-auto" type="submit">
        <Send className="mr-2 h-4 w-4" /> データ消去報告
      </Button>
    </>
  )
}

export default CGAssetApplyDownloadRemovalFormConfirm
