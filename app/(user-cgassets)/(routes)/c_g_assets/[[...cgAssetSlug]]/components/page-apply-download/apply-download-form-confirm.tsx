"use client"

import { Fragment, Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { Undo2, Save, Plus } from "lucide-react"
import { dateFormat } from "@/lib/utils"

import {
  ApplyDownload,
  CgAsset,
  User,
} from "@/graphql/generated/graphql";

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
// import { ApplyDownloadFormSchema, ApplyDownloadFormValues } from "./apply-download-form"

interface CGAssetApplyDownloadFormConfirmProps {
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

export const CGAssetApplyDownloadFormConfirm: React.FC<CGAssetApplyDownloadFormConfirmProps> = ({
  form,
  initialData,
  cgAsset,
  manageUsers,
  setDialogOpen,
  params,
  loading,
  onPrev,
}) => {

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
                {manageUsers && manageUsers.filter((manageUser) => {
                  return manageUser.id === field.value;
                })
                  .map((manageUser) => {
                    return manageUser.name;
                  })}
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
        onClick={onPrev}>
        <Undo2 className="mr-2 h-4 w-4" /> 修正する
      </Button>
      <Button disabled={loading} className="ml-auto" type="submit">
        {initialData ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />} 申請
      </Button>
    </>
  )
}

export default CGAssetApplyDownloadFormConfirm