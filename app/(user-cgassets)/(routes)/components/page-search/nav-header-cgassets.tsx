"use client";

import Image from 'next/image'
import { useState } from "react"
import { useForm } from "react-hook-form"

import {
  CgAssetCate,
} from '@/graphql/generated/graphql';

import {
  Form,
  // FormControl,
  FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form-raw"
import { Input } from "@/components/ui/input-raw"
import { Button } from "@/components/ui/button-raw"

import { useCgAssetsSearchForm, CgAssetsSearchFormValues } from '@/hooks/use-cgassets-search-form';

interface SearchFormProps {
  searchData: CgAssetsSearchFormValues;
  assetCates: CgAssetCate[];
  onSearchFromSubmit: (data: CgAssetsSearchFormValues) => void;
};

export const NavHeaderCgAssets: React.FC<SearchFormProps> = ({
  searchData,
  assetCates,
  onSearchFromSubmit
}) => {
  const storeSearchInfo = useCgAssetsSearchForm();
  const [loading, setLoading] = useState(false);

  const form = useForm<CgAssetsSearchFormValues>({
    defaultValues: searchData //{ ...storeSearchInfo.cgAssetsSearchFormData, ...searchData }
  });

  const onSubmit = (data: CgAssetsSearchFormValues) => {
    setLoading(true);

    // console.log(`data.assetCates: ${JSON.stringify(data.assetCates)}`)
    // console.log(`data.assetCates CHECK: ${!data.assetCates}`)

    if (typeof data.assetCates === 'object' && data.assetCates.length === 0) {
      form.setValue('assetCates', [assetCates[0].id])
      data.assetCates = [assetCates[0].id];
    } else if (data.assetCates && typeof data.assetCates === 'string') {
      form.setValue('assetCates', [data.assetCates as unknown as string])
      data.assetCates = [data.assetCates as unknown as string];
    }

    onSearchFromSubmit(data);

    setLoading(false);
  }

  return (
    <Form {...form}>
      <div className="search__box">
        <FormField
          control={form.control}
          name="assetCates"
          render={({ field }) => (
            <div className="search__pulldownbox">
              <select
                name="search__pulldown"
                className="search__pulldown"
                disabled={loading}
                onChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                {assetCates && assetCates.map((assetCate, idx) => (
                  <option
                    key={assetCate.id}
                    value={assetCate.id}
                    className={idx === 0 ? 'first' : ''}
                  >
                    {assetCate.desc}
                  </option>
                ))}
              </select>
            </div>
          )}
        />
        <FormField
          control={form.control}
          disabled={loading}
          name="keyword"
          render={({ field }) => (
            <div className="search__formbox">
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <Input id="search-input" disabled={loading} placeholder="" {...field} />
                <Button id="btn" type="submit" disabled={loading}><Image
                  src="/assets/images/search_icon.svg" width="22" height="22" decoding="async"
                  alt="検索" /></Button>
              </form>
            </div>
          )}
        />
      </div>
    </Form>
  )
}
