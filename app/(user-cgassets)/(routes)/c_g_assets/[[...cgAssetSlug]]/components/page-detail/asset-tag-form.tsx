"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CreateCgAssetTagMutation,
  CreateCgAssetTagDocument,
  CgAsset,
  // CgAssetTag,
} from "@/graphql/generated/graphql";

import { Input } from "@/components/ui/input-raw"
import { Button } from "@/components/ui/button-raw"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  tag: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }),
});

type AssetTagFormValues = z.infer<typeof formSchema>

interface AssetTagFormProps {
  cgAsset: CgAsset;
};

export const AssetTagForm: React.FC<AssetTagFormProps> = ({
  cgAsset
}) => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(false);

  // const title = 'タグ追加';
  // const description = 'タグの追加';
  const toastMessage = 'タグが追加されました。';
  const action = '追加';

  const defaultValues = {
    tag: ''
  }

  const form = useForm<AssetTagFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: AssetTagFormValues) => {

    if (!data.tag) {
      toast.error('タグをご入力ください。', {
        duration: 1000
      });
      return;
    }

    try {
      setLoading(true);

      const ret: FetchResult<CreateCgAssetTagMutation>
        = await apolloClient
          .mutate({
            mutation: CreateCgAssetTagDocument,
            variables: {
              asset_db_id: cgAsset.id,
              tagged_user_id: (session?.user as { userId: string }).userId,
              tag_add_edit_flg: false,
              ...data
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

      form.reset({}, { keepValues: false });
      router.refresh();
      toast.success(toastMessage);
    } catch (error: any) {
      if (error.message === "_CGASSETTAG_SAME_TAG_WITH_THIS_ASSET_DB_ID_EXISTS_") {
        toast.error('登録済みのタグです。');
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <div className="input_box">
          <form id="tag-form" onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <Input id="tag-input" disabled={loading} placeholder="タグを入力" {...field} />
              )}
            />
            <button id="tag_input-btn" type="submit">追加</button>
          </form>
        </div>
      </Form>
    </>
  );
};
