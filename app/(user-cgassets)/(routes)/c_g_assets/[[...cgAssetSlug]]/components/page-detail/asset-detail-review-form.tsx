"use client"

import * as z from "zod"
import { Dispatch, SetStateAction, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { X } from "lucide-react"

import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CreateCgAssetReviewMutation,
  CreateCgAssetReviewDocument,
  CgAsset,
  // CgAssetReview,
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
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

const formSchema = z.object({
  review: z.string({ required_error: '必須入力', invalid_type_error: '入力値に誤りがります' }),
});

type AssetDetailReviewFormValues = z.infer<typeof formSchema>

interface AssetDetailReviewFormProps {
  cgAsset: CgAsset;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export const AssetDetailReviewForm: React.FC<AssetDetailReviewFormProps> = ({
  cgAsset,
  setDialogOpen,
}) => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(false);

  // const title = 'コメント追加';
  // const description = 'コメントの追加';
  const toastMessage = 'コメントが追加されました。';
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
      toast.error('コメントをご入力ください。', {
        duration: 1000
      });
      return;
    }

    try {
      setLoading(true);

      const ret: FetchResult<CreateCgAssetReviewMutation>
        = await apolloClient
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
      setDialogOpen(false);

      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="コメント追加" description={`アセットID: ${cgAsset?.asset_id} にコメントする`} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">コメント入力</FormLabel>
                  <FormControl className="">
                    <Textarea
                      disabled={loading}
                      placeholder="コメントを記述"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => setDialogOpen(false)}>
            <X className="mr-2 h-4 w-4" /> 閉じる
          </Button>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
