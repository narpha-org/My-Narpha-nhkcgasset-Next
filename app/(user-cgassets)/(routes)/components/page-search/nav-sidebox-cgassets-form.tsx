import { useState } from "react"
import { useForm } from "react-hook-form"
import _ from 'lodash';

import {
  CgAssetCate,
  CgAssetSearchAppProd,
  CgAssetSearchGenre
} from '@/graphql/generated/graphql';

import {
  Form,
  // FormControl,
  FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form-raw"

import { useCgAssetsSearchForm, CgAssetsSearchFormValues } from '@/hooks/use-cgassets-search-form';

interface NavSideboxCgAssetsFormProps {
  searchData: CgAssetsSearchFormValues;
  assetCates: CgAssetCate[];
  assetSearchGenres: CgAssetSearchGenre[];
  assetSearchAppProds: CgAssetSearchAppProd[];
  onSearchFromSubmit: (data: CgAssetsSearchFormValues) => void;
  isNavHeaderSubmitting: boolean;
  parentLoading: boolean;
};

export const NavSideboxCgAssetsForm: React.FC<NavSideboxCgAssetsFormProps> = ({
  searchData,
  assetCates,
  assetSearchGenres,
  assetSearchAppProds,
  onSearchFromSubmit,
  isNavHeaderSubmitting,
  parentLoading,
}) => {
  // const storeSearchInfo = useCgAssetsSearchForm();
  const [loading, setLoading] = useState(false);

  const form = useForm<CgAssetsSearchFormValues>({
    defaultValues: searchData //{ ...storeSearchInfo.cgAssetsSearchFormData, ...searchData }
  });

  const onSubmit = (data: CgAssetsSearchFormValues) => {
    setLoading(true);

    if (!parentLoading) {
      onSearchFromSubmit(data);
    }

    setLoading(false);
  }

  if (
    isNavHeaderSubmitting &&
    (
      _.isEqual(form.getValues("assetCates"), searchData.assetCates) === false ||
      _.isEqual(form.getValues("assetGenres"), searchData.assetGenres) === false ||
      _.isEqual(form.getValues("assetAppProds"), searchData.assetAppProds) === false
    )
  ) {
    form.setValue("assetCates", searchData.assetCates)
    form.setValue("assetGenres", searchData.assetGenres)
    form.setValue("assetAppProds", searchData.assetAppProds)
  }

  // if (isNavHeaderSubmitting || parentLoading) {
  //   // setLoading(true)
  // } else {
  //   // setLoading(false)
  // }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <h2>フィルター</h2>
        <dl className="sidebox__type">
          <dt>アセット種別</dt>
          {assetCates.map((assetCate) => (
            <FormField
              key={assetCate.id}
              control={form.control}
              name="assetCates"
              render={({ field }) => {
                return (
                  <dd>
                    <label className="sidebox__check-input">
                      <input
                        type="checkbox"
                        className="sidebox__input"
                        checked={field.value?.includes(assetCate.id)}
                        disabled={loading}
                        onChange={(event) => {
                          const checked = event.target.checked;

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
                      <span className="sidebox__input-text">
                        {assetCate.desc}
                      </span>
                    </label>
                  </dd>
                )
              }}
            />
          ))}
        </dl>
        <dl className="sidebox__genre">
          <dt>ジャンル</dt>
          {assetSearchGenres.map((assetGenre) => (
            <FormField
              key={assetGenre.code}
              control={form.control}
              name="assetGenres"
              render={({ field }) => {
                return (
                  <dd>
                    <label className="sidebox__check-input">
                      <input
                        type="checkbox"
                        className="sidebox__input"
                        checked={field.value?.includes(assetGenre.code)}
                        disabled={loading}
                        onChange={(event) => {
                          const checked = event.target.checked;

                          const ret = checked
                            ? field.onChange([...field.value, assetGenre.code])
                            : field.onChange(
                              field.value?.filter(
                                (value) => value !== assetGenre.code
                              )
                            )

                          if (checked) {
                            if (assetGenre.code === '_ALL_') {
                              form.setValue("assetGenres", ['_ALL_'])
                            } else {
                              form.setValue("assetGenres", form.getValues("assetGenres").filter(
                                (value) => value !== '_ALL_'
                              ))
                            }
                          }

                          form.handleSubmit(onSubmit)();

                          return ret;
                        }}
                      />
                      <span className="sidebox__input-text">
                        {assetGenre.desc}
                      </span>
                    </label>
                  </dd>
                )
              }}
            />
          ))}
        </dl>
        <dl className="sidebox__software">
          <dt>制作ソフトウェア</dt>
          {assetSearchAppProds.map((assetAppProd) => (
            <FormField
              key={assetAppProd.code}
              control={form.control}
              name="assetAppProds"
              render={({ field }) => {
                return (
                  <dd>
                    <label className="sidebox__check-input">
                      <input
                        type="checkbox"
                        className="sidebox__input"
                        checked={field.value?.includes(assetAppProd.code)}
                        disabled={loading}
                        onChange={(event) => {
                          const checked = event.target.checked;

                          const ret = checked
                            ? field.onChange([...field.value, assetAppProd.code])
                            : field.onChange(
                              field.value?.filter(
                                (value) => value !== assetAppProd.code
                              )
                            )

                          if (checked) {
                            if (assetAppProd.code === '_ALL_') {
                              form.setValue("assetAppProds", ['_ALL_'])
                            } else {
                              form.setValue("assetAppProds", form.getValues("assetAppProds").filter(
                                (value) => value !== '_ALL_'
                              ))
                            }
                          }

                          form.handleSubmit(onSubmit)();

                          return ret;
                        }}
                      />
                      <span className="sidebox__input-text">
                        {assetAppProd.desc}
                      </span>
                    </label>
                  </dd>
                )
              }}
            />
          ))}
        </dl>
      </form>
    </Form >
  )
}
