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
  User,
  CgaRegistrantAffiliation,
  UserRoleCgAssetStore,
  CreateUserDocument,
  UpdateUserDocument,
  DeleteUserDocument,
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

const formSchema = z.object({
  name: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須入力",
  }),
  email: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須入力",
  }),
  regist_affili_id: z.string({ required_error: '必須選択', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須選択",
  }),
  regist_affili_code: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' })
    .min(1, {
      message: "必須入力",
    })
    .max(50, {
      message: "主所属コード は 50 文字以内でご入力ください。",
    }),
  user_role_cgas_id: z.string({ required_error: '必須選択', invalid_type_error: '入力値に誤りがります' }).min(1, {
    message: "必須選択",
  }),
});

type UserFormValues = z.infer<typeof formSchema>

interface UserFormProps {
  initialData: User | null;
  registrantAffiliations: CgaRegistrantAffiliation[];
  userRoleCgAssetStores: UserRoleCgAssetStore[];
};

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  registrantAffiliations,
  userRoleCgAssetStores,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Oktaユーザ情報（本システムのみ） 編集' : 'Oktaユーザ情報（本システムのみ） 新規追加';
  const description = initialData ? '指定Oktaユーザ情報の編集 Okta環境の情報は更新しません' : '新規Oktaユーザの追加 Okta環境の情報は更新しません';
  const toastMessage = initialData ? '本システム上のOktaユーザ情報のみ更新されました。' : '本システム上のOktaユーザ情報のみ新規追加されました。';
  const action = initialData ? '更新' : '追加';

  const defaultValues = initialData ? {
    ...initialData,
    regist_affili_id: initialData?.registrantAffiliation?.id,
    regist_affili_code: initialData?.regist_affili_code as string | undefined,
    user_role_cgas_id: initialData?.roleCGAssetStore?.id,
  } : {
    name: '',
    email: '',
    regist_affili_id: '',
    regist_affili_code: '',
    user_role_cgas_id: '',
  }

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await apolloClient
          .mutate({
            mutation: UpdateUserDocument,
            variables: {
              user: {
                id: params.userId,
                ...data
              },
            },
          })
      } else {
        await apolloClient
          .mutate({
            mutation: CreateUserDocument,
            variables: {
              user: {
                ...data
              },
            },
          })
      }
      router.refresh();
      router.push(`/admin/users`);
      toast.success(toastMessage, {
        duration: 6000
      });
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const ret = await apolloClient
        .mutate({
          mutation: DeleteUserDocument,
          variables: {
            id: params.userId,
          },
        })

      // console.log("ret", ret);
      if (ret.errors && ret.errors[0] && ret.errors[0].message) {
        throw new Error(ret.errors[0].message)
      }

      router.refresh();
      router.push(`/admin/users`);
      toast.success('本システム上のOktaユーザ情報のみ削除されました。Okta認証で再度自動でユーザが作成されます。', {
        duration: 6000
      });
    } catch (error: any) {
      toast.error('削除できません。このOktaユーザ情報で追加／更新されたCGアセット情報が存在します。', {
        duration: 6000
      });
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oktaユーザ名</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="山田太郎" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス(変更不可)</FormLabel>
                  <FormControl>
                    <Input disabled={true} placeholder="変更不可" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regist_affili_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>主所属名</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="主所属名を選択" />
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
              name="regist_affili_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>主所属コード</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="#12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_role_cgas_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CGアセットストア ロール</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="CGアセットストア ロールを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userRoleCgAssetStores && userRoleCgAssetStores.map((userRoleCgAssetStore) => (
                        <SelectItem key={userRoleCgAssetStore.id} value={userRoleCgAssetStore.id}>{userRoleCgAssetStore.desc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => router.push(`/admin/users`)}>
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
