"use client"

import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { X, Save, Check } from "lucide-react"
// import { useParams, useRouter } from "next/navigation"

import {
  ApplyDownload,
  CgAsset,
  User,
} from "@/graphql/generated/graphql";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/text-area"
import { DatePicker } from "@/components/ui/date-picker"

import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"
// import { ApplyDownloadFormSchema, ApplyDownloadFormValues } from "./apply-download-form"

interface CGAssetApplyDownloadApplyFormInputProps {
  form: UseFormReturn<any>;
  initialData: ApplyDownload | null;
  cgAsset: CgAsset | null;
  manageUsers: User[] | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    cgAssetSlug: string[];
  };
  loading: boolean;
  onNext: () => void;
};

export const CGAssetApplyDownloadApplyFormInput: React.FC<CGAssetApplyDownloadApplyFormInputProps> = ({
  form,
  initialData,
  cgAsset,
  manageUsers,
  setDialogOpen,
  params,
  loading,
  onNext
}) => {
  // const params = useParams() as unknown as CGAssetPageProps['params'];
  // const router = useRouter();
  console.log(`manageUsers: ${JSON.stringify(manageUsers)}`)

  return (
    <>
      <div className="md:grid md:grid-cols-3 gap-8">
        <FormField
          control={form.control}
          name="manage_user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>番組責任者</FormLabel>
              <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue defaultValue={field.value} placeholder="申請先の番組責任者を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {manageUsers && manageUsers.map((manageUser) => (
                    <SelectItem key={manageUser.id} value={manageUser.id}>{manageUser.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
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
          name="date_usage_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>利用期間・開始</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={(date) => form.setValue("date_usage_start", date)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_usage_end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>利用期間・終了</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={(date) => form.setValue("date_usage_end", date)}
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
          name="purpose_of_use_txt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>利用目的</FormLabel>
              <FormControl>
                <Textarea
                  disabled={loading}
                  placeholder="利用目的"
                  className="h-80"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="etc_txt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>その他</FormLabel>
              <FormControl>
                <Textarea
                  disabled={loading}
                  placeholder="その他"
                  className="h-60"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
        onClick={() => setDialogOpen(false)}>
        <X className="mr-2 h-4 w-4" /> 閉じる
      </Button>
      <Button disabled={loading} className="ml-auto" type="button" onClick={form.handleSubmit(onNext)}>
        {initialData ? <Save className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />} 確認
      </Button>
    </>
  )
}

export default CGAssetApplyDownloadApplyFormInput