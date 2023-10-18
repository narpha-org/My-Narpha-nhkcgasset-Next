import { useState } from "react"
import { useForm } from "react-hook-form"
import { Search } from 'lucide-react';

import {
  CgAssetCate,
  CgAssetSearchAppProd,
  CgAssetSearchTag
} from '@/graphql/generated/graphql';

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
  assetSearchTags: CgAssetSearchTag[];
  assetSearchAppProds: CgAssetSearchAppProd[];
  onSearchFromSubmit: (data: CGAssetSearchFormValues) => void;
};

export const SearchForm: React.FC<SearchFormProps> = ({
  assetCates,
  assetSearchTags,
  assetSearchAppProds,
  onSearchFromSubmit
}) => {
  const storeSearchInfo = useSearchForm();
  const [loading, setLoading] = useState(false);

  const form = useForm<CGAssetSearchFormValues>({
    defaultValues: storeSearchInfo.searchFormData
  });

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
              {assetSearchTags.map((assetTag) => (
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
              {assetSearchAppProds.map((assetAppProd) => (
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
