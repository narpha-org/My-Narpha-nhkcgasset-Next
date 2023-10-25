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
  CgAsset,
  CgAssetReview,
  CreateCgAssetReviewDocument,
} from "@/graphql/generated/graphql";

import { Textarea } from "@/components/ui/text-area"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  review: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }),
});

type AssetDetailReviewFormValues = z.infer<typeof formSchema>

interface AssetDetailReviewFormProps {
  cgAsset: CgAsset;
};

export const AssetDetailReviewForm: React.FC<AssetDetailReviewFormProps> = ({
  cgAsset
}) => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(false);

  // const title = 'コメント・レビュー追加';
  // const description = 'コメント・レビューの追加';
  const toastMessage = 'コメント・レビューが追加されました。';
  const action = '追加';

  const defaultValues = {
    review: ''
  }

  const form = useForm<AssetDetailReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: AssetDetailReviewFormValues) => {

    if (!data.review) {
      toast.error('コメント・レビューをご入力ください。', {
        duration: 1000
      });
      return;
    }

    try {
      setLoading(true);

      const ret: FetchResult<{
        CreateCgAssetReview: CgAssetReview;
      }> = await apolloClient
        .mutate({
          mutation: CreateCgAssetReviewDocument,
          variables: {
            asset_db_id: cgAsset.id,
            reviewed_user_id: (session?.user as { userId: string }).userId,
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
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="">
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">コメント・レビュー入力</FormLabel>
                  <FormControl className="">
                    <Textarea
                      disabled={loading}
                      placeholder="コメント・レビューを記述"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />
            <Button disabled={loading} className="ml-auto" type="submit">
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
