"use client"

import { Dispatch, SetStateAction, Fragment } from "react";
// import { useParams, useRouter } from "next/navigation"
import { UseFormReturn } from "react-hook-form";
import { X, Save, Plus } from "lucide-react"
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
import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"

interface CGAssetApplyDownloadApprovalFormConfirmProps {
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

export const CGAssetApplyDownloadApprovalFormConfirm: React.FC<CGAssetApplyDownloadApprovalFormConfirmProps> = ({
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

  // console.log(`manageUser.name: ${form.getValues('manageUser.name')}`);
  // console.log(`program_id: ${form.getValues('program_id')}`);
  // console.log(`program_name: ${form.getValues('program_name')}`);
  // console.log(`date_usage_start: ${form.getValues('date_usage_start')}`);
  // console.log(`date_usage_end: ${form.getValues('date_usage_end')}`);
  // console.log(`purpose_of_use_txt: ${form.getValues('purpose_of_use_txt')}`);
  // console.log(`etc_txt: ${form.getValues('etc_txt')}`);

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
                {dateFormat(field.value, 'yyyy/MM/dd')}
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
                {dateFormat(field.value, 'yyyy/MM/dd')}
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
                {field.value && field.value.split("\n").map((item, index) => {
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
                {field.value && field.value.split("\n").map((item, index) => {
                  return (
                    <Fragment key={index}>{item}<br /></Fragment>
                  );
                })}
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
        {initialData ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />} 承認
      </Button>
    </>
  )
}

export default CGAssetApplyDownloadApprovalFormConfirm
