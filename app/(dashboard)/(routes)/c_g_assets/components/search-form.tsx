"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Search } from 'lucide-react';

import { CgAssetCate } from '@/graphql/generated/graphql';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useSearchForm, CGAssetSearchFormValues } from '@/hooks/use-search-form';

interface SearchFormProps {
  assetCates: CgAssetCate[];
  onSearchFromSubmit: (data: CGAssetSearchFormValues) => void;
};

export const SearchForm: React.FC<SearchFormProps> = ({
  assetCates,
  onSearchFromSubmit
}) => {
  const storeSearchInfo = useSearchForm();
  const [loading, setLoading] = useState(false);

  const form = useForm<CGAssetSearchFormValues>({
    defaultValues: storeSearchInfo.searchFormData
  });

  const assetTags = [
    {
      code: "_ALL_",
      desc: "全て"
    },
    {
      code: "セット",
      desc: "セット"
    },
    {
      code: "建物",
      desc: "建物"
    },
    {
      code: "乗り物",
      desc: "乗り物"
    },
    {
      code: "家具",
      desc: "家具"
    },
    {
      code: "植物動物",
      desc: "植物動物"
    },
    {
      code: "キャラクタ",
      desc: "キャラクタ"
    },
    {
      code: "兵器",
      desc: "兵器"
    },
    {
      code: "汎用素材",
      desc: "汎用素材"
    },
    {
      code: "エフェクト素材",
      desc: "エフェクト素材"
    },
  ]

  const assetAppProds = [
    {
      code: "VizRT",
      desc: "VizRT"
    },
    {
      code: "Unity",
      desc: "Unity"
    },
    {
      code: "UnrealEngine",
      desc: "UnrealEngine"
    },
    {
      code: "Maya",
      desc: "Maya"
    },
    {
      code: "3dsMax",
      desc: "3dsMax"
    },
  ]

  const onSubmit = (data: CGAssetSearchFormValues) => {
    setLoading(true);

    onSearchFromSubmit(data);

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="column items-center pb-6">
          アセット種別
        </div>
        <FormField
          control={form.control}
          name="assetCates"
          render={() => (
            <FormItem>
              {assetCates.map((assetCate) => (
                <FormField
                  key={assetCate.id}
                  control={form.control}
                  name="assetCates"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={assetCate.id}
                        className="items-center space-x-3 space-y-0 p-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(assetCate.id)}
                            disabled={loading}
                            onCheckedChange={(checked) => {

                              const ret = checked
                                ? field.onChange([...field.value, assetCate.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== assetCate.id
                                  )
                                )
                              form.handleSubmit(onSubmit)();

                              return ret;
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {assetCate.desc}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="column items-center py-6">
          ジャンル
        </div>
        <FormField
          control={form.control}
          name="assetTags"
          render={() => (
            <FormItem>
              {assetTags.map((assetTag) => (
                <FormField
                  key={assetTag.code}
                  control={form.control}
                  name="assetTags"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={assetTag.code}
                        className="items-center space-x-3 space-y-0 p-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(assetTag.code)}
                            disabled={loading}
                            onCheckedChange={(checked) => {

                              const ret = checked
                                ? field.onChange([...field.value, assetTag.code])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== assetTag.code
                                  )
                                )
                              form.handleSubmit(onSubmit)();

                              return ret;
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {assetTag.desc}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="column items-center py-6">
          制作ソフトウェア
        </div>
        <FormField
          control={form.control}
          name="assetAppProds"
          render={() => (
            <FormItem>
              {assetAppProds.map((assetAppProd) => (
                <FormField
                  key={assetAppProd.code}
                  control={form.control}
                  name="assetAppProds"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={assetAppProd.code}
                        className="items-center space-x-3 space-y-0 p-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(assetAppProd.code)}
                            disabled={loading}
                            onCheckedChange={(checked) => {

                              const ret = checked
                                ? field.onChange([...field.value, assetAppProd.code])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== assetAppProd.code
                                  )
                                )
                              form.handleSubmit(onSubmit)();

                              return ret;
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {assetAppProd.desc}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="column items-center py-6">
          キーワード
        </div>
        <div className="column items-center">
          <FormField
            control={form.control}
            disabled={loading}
            name="keyword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Input disabled={loading} placeholder="キーワード" {...field} />
                    <Button type="submit" disabled={loading}><Search className="h-4 w-4" /></Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
