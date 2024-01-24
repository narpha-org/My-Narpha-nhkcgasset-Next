"use client"

import { Fragment, useState } from "react"
import Image from 'next/image'
// import Link from "next/link"
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { format } from 'date-fns'
// import { dateFormat } from "@/lib/utils"

import {
  CgAsset,
  CgAssetCate,
  CgaRegistrantAffiliation,
  CgaViewingRestriction,
  CgaBroadcastingRight,
  CgaSharedArea,
  CgAssetTag,
  CgAssetUploadDir,
  // CgaRevisionHistory,
  CgAssetReview,
} from "@/graphql/generated/graphql";

import { Input } from "@/components/ui/input-raw"
import { Button } from "@/components/ui/button-raw"
import { AlertModal } from "@/components/modals/alert-modal"
import {
  // Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage,
} from "@/components/ui/form-raw"
// import { Textarea } from "@/components/ui/text-area-raw"
// import ImageUpload, { UploadImageProps } from "@/components/ui/image-upload-cgasset"
// import FileUpload, { UploadFileProps } from "@/components/ui/file-upload-cgasset"
import { cn } from '@/lib/utils';

// import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"
// import CGAssetPreviewDialog from "./c_g_asset-preview-dialog"
// import AssetRevisionHistoryBlock from "../page-detail/asset-revision-history-block"

interface CGAssetFormInput2Props {
  form: UseFormReturn<any>;
  cgAsset: CgAsset | null;
  assetCates: CgAssetCate[];
  registrantAffiliations: CgaRegistrantAffiliation[];
  viewingRestrictions: CgaViewingRestriction[];
  broadcastingRights: CgaBroadcastingRight[];
  sharedAreas: CgaSharedArea[];
  uploadDirs: CgAssetUploadDir[];
  params: {
    cgAssetSlug: string[];
  };
  loading: boolean;
  onSubmit: (data: any) => Promise<void>;
  onPrev: () => void;
};

export const CGAssetFormInput2: React.FC<CGAssetFormInput2Props> = ({
  form,
  cgAsset,
  assetCates,
  registrantAffiliations,
  viewingRestrictions,
  broadcastingRights,
  sharedAreas,
  uploadDirs,
  params,
  loading,
  onSubmit,
  onPrev
}) => {
  const [open, setOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [composing, setComposition] = useState(false);
  const startComposition = () => setComposition(true);
  const endComposition = () => setComposition(false);

  const [inputTag, setInputTag] = useState('');
  const [deleteAssetTagId, setDeleteAssetTagId] = useState('');

  const onSubmitFormInput2 = () => {
    if (cgAsset) {
      form.setValue("submitFormInput", 2);
      form.handleSubmit(onSubmit)();
    } else {
      onPrev()
    }
  }

  const onTagDelete = () => {
    const newValue = [...form.getValues('assetTags')
      .filter((current) => current.id !== deleteAssetTagId)
    ];
    form.setValue("assetTags", [...newValue]);

    setOpen(false);
  }

  // console.log(`CGAssetFormInput2 form.getValues("reviews"): ${JSON.stringify(form.getValues("reviews"))}`)

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onTagDelete}
        loading={loading}
        title={deleteConfirmText}
        description=""
        btnCancelVariant="outline"
        btnDoVariant="default"
        btnDoText="削除"
      />
      {/* <!-- main --> */}
      <main className="maincon">
        <div className="registration">
          <div className="registration__inner">
            <div className="registration__mainbox">
              <div className="registration__title">
                <FormField
                  control={form.control}
                  name="asset_name"
                  render={({ field }) => (
                    <FormItem>
                      <h2>{field.value ?? "アセットタイトル"}</h2>
                    </FormItem>
                  )}
                />
              </div>
              <div className="registration__maincon">
                <div className="registration__maincon-left">
                  <h2 className="comment_title">コメント</h2>
                  <FormField
                    control={form.control}
                    name="reviews"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="comment_block">
                            {field.value && field.value.map((reviewObj: CgAssetReview, idx) => {
                              return (
                                <div key={idx} className="comment-box">
                                  <div className="toggle_button">
                                    <input
                                      id="toggle"
                                      className={cn(
                                        'toggle_input',
                                        loading && 'opacity-50'
                                      )}
                                      type='checkbox'
                                      checked={reviewObj.valid_flg}
                                      onChange={() => field.onChange(field.value.map((obj: CgAssetReview) => {

                                        if (obj.id === reviewObj.id) {
                                          obj.valid_flg = !obj.valid_flg;
                                        }

                                        return obj
                                      }))}
                                      disabled={loading}
                                      style={loading ? { cursor: 'default' } : { cursor: 'pointer' }}
                                    />
                                    <label htmlFor="toggle" className={cn(
                                      'toggle_label',
                                      loading && 'opacity-50'
                                    )} />
                                  </div>
                                  <p>{reviewObj.review.split("\n").map((item, index) => {
                                    return (
                                      <Fragment key={index}>{item}<br /></Fragment>
                                    );
                                  })}</p>
                                </div>
                              )
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="registration__maincon-right">

                  <div className="registration__maincon-user-tag">
                    <h2>ユーザータグリスト</h2>
                    <FormField
                      control={form.control}
                      name="assetTags"
                      render={({ field }) => (
                        <FormItem>
                          <div className="tag_list">
                            {field.value && field.value.map((assetTag: CgAssetTag, idx) => {
                              return (
                                <>
                                  <Button
                                    id={idx}
                                    key={assetTag?.id}
                                    type="button"
                                    disabled={loading}
                                    className={cn(
                                      'tag_gray',
                                      assetTag?.tag_add_edit_flg === true && 'on',
                                      loading && 'opacity-50'
                                    )}
                                    onClick={() => {
                                      setDeleteAssetTagId(() => assetTag?.id);
                                      setDeleteConfirmText(() => `タグ: ${assetTag?.tag} を削除します`);
                                      setOpen(true);
                                    }}
                                  >
                                    {assetTag?.tag}
                                  </Button>
                                </>
                              )
                            })}
                            <Input
                              id="tag_form"
                              className={cn(
                                'input-text js-input',
                                loading && 'opacity-50'
                              )}
                              type="text"
                              value={inputTag}
                              disabled={loading}
                              onCompositionStart={startComposition}
                              onCompositionEnd={endComposition}
                              onChange={(event) => setInputTag((event.target as HTMLInputElement).value)}
                              onKeyDown={(event) => {

                                if (event && event.code && event.code.toLowerCase() === 'enter') {
                                  event.preventDefault();
                                } else {
                                  return;
                                }

                                if (!inputTag) {
                                  return;
                                }

                                if (composing) {
                                  return;
                                }

                                const newTag = inputTag;
                                setInputTag('');

                                return field.onChange([...field.value, {
                                  id: "new" + (field.value.length + 1),
                                  tag: newTag,
                                  tag_add_edit_flg: true
                                }])
                              }}
                            />
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                </div>

              </div>
            </div>
            <div className="registration__side">
              <div className="registration__sidestatus">
                <div className="registration__sidestatus-con">
                  <h2>公開ステータス</h2>
                  <div className="keepbox">
                    <button
                      id="dl-btn02"
                      type="button"
                      disabled={loading}
                      className={cn(
                        'btn',
                        loading && 'opacity-50'
                      )}
                      style={loading ? { cursor: 'default' } : { cursor: 'pointer' }}
                      onClick={form.handleSubmit(onSubmitFormInput2)}
                    >保存</button>
                    <FormField
                      control={form.control}
                      name="updated_at"
                      render={({ field }) => (
                        <FormItem>
                          {field.value && (
                            <p>
                              {format(new Date(field.value), "yyyy.MM.dd")}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <a
              onClick={() => { if (!loading) form.handleSubmit(onPrev)() }}
              className={cn(
                'registration__regist_back_btn',
                loading && 'opacity-50'
              )}
              style={loading ? { cursor: 'default' } : { cursor: 'pointer' }}
            >
              <Image src="/assets/images/regist_back_btn_arrow.svg" alt="矢印" width="13" height="22" decoding="async"
                className="arrow" />
            </a>
          </div>
        </div>
      </main>
    </>
  );
};
