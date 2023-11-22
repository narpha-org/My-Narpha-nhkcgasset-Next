"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  UserRoleCgAssetStore,
  CreateUserRoleCgAssetStoreMutation,
  CreateUserRoleCgAssetStoreDocument,
  UpdateUserRoleCgAssetStoreMutation,
  UpdateUserRoleCgAssetStoreDocument,
  DeleteUserRoleCgAssetStoreMutation,
  DeleteUserRoleCgAssetStoreDocument,
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

import { roleCGAssetStores } from "../../components/columns"

const formSchema = z.object({
  role: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須入力",
  }),
  desc: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須入力",
  }),
  order: z.coerce.number({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }),
  valid_flg: z.boolean().default(false).optional(),
});

type UserRoleCgAssetStoreFormValues = z.infer<typeof formSchema>

interface UserRoleCgAssetStoreFormProps {
  initialData: UserRoleCgAssetStore | null;
};

export const UserRoleCgAssetStoreForm: React.FC<UserRoleCgAssetStoreFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'CGアセットストアロール 編集' : 'CGアセットストアロール 新規追加';
  const description = initialData ? '指定CGアセットストアロールの編集' : '新規CGアセットストアロールの追加';
  const toastMessage = initialData ? 'CGアセットストアロールが更新されました。' : 'CGアセットストアロールが新規追加されました。';
  const action = initialData ? '更新' : '追加';

  const defaultValues = initialData ? {
    ...initialData,
    order: initialData?.order as number | undefined,
  } : {
    role: '',
    desc: '',
    order: undefined,
    valid_flg: false,
  }

  const form = useForm<UserRoleCgAssetStoreFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserRoleCgAssetStoreFormValues) => {
    try {
      setLoading(true);

      let ret: FetchResult;
      if (initialData) {
        ret = await apolloClient
          .mutate({
            mutation: UpdateUserRoleCgAssetStoreDocument,
            variables: {
              id: params.userRoleCGAssetStoreId,
              ...data
            },
          }) as FetchResult<UpdateUserRoleCgAssetStoreMutation>
      } else {
        ret = await apolloClient
          .mutate({
            mutation: CreateUserRoleCgAssetStoreDocument,
            variables: {
              ...data
            },
          }) as FetchResult<CreateUserRoleCgAssetStoreMutation>
      }

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
      router.push(`/admin/user_role_c_g_asset_stores`);
      toast.success(toastMessage);
    } catch (error: any) {
      if (error.message === "_CODE_IS_INVALID_") {
        toast.error("不正なユーザ種類です。");
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      const ret: FetchResult<DeleteUserRoleCgAssetStoreMutation>
        = await apolloClient
          .mutate({
            mutation: DeleteUserRoleCgAssetStoreDocument,
            variables: {
              id: params.userRoleCGAssetStoreId,
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
      router.push(`/admin/user_role_c_g_asset_stores`);
      toast.success('CGアセットストアロールが削除されました。');
    } catch (error: any) {
      toast.error('削除できません。このCGアセットストアロールを使用中のCGアセット情報が存在します。');
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
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CGアセットストアロール</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="CGアセットストアロール" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザ種類</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="ユーザ種類の選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleCGAssetStores.map((roleCGAssetStore) => (
                        <SelectItem key={roleCGAssetStore.key} value={roleCGAssetStore.key}>{roleCGAssetStore.key} ({roleCGAssetStore.value})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>表示順</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="表示順" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valid_flg"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      有効フラグ
                    </FormLabel>
                    <FormDescription>
                      このCGアセットストアロールを選択項目として有効にする
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => router.push(`/admin/user_role_c_g_asset_stores`)}>
            キャンセル
          </Button>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
