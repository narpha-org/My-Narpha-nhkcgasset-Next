"use client"

import { Fragment, useState } from "react"
// import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import { UseFormReturn } from "react-hook-form";
import { format } from 'date-fns'
import { dateFormat } from "@/lib/utils"

import {
  CgAsset,
  CgAssetCate,
  CgaRegistrantAffiliation,
  CgaViewingRestriction,
  CgaBroadcastingRight,
  CgaSharedArea,
  CgAssetTag,
  CgAssetUploadDir,
  CgaRevisionHistory,
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
import { Textarea } from "@/components/ui/text-area-raw"
import ImageUpload, { UploadImageProps } from "@/components/ui/image-upload-cgasset"
import FileUpload, { UploadFileProps } from "@/components/ui/file-upload-cgasset"
import { cn } from '@/lib/utils';

import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"
import CGAssetPreviewDialog from "./c_g_asset-preview-dialog"
// import AssetRevisionHistoryBlock from "../page-detail/asset-revision-history-block"

interface CGAssetFormInput1Props {
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
  onNext: () => void;
};

export const CGAssetFormInput1: React.FC<CGAssetFormInput1Props> = ({
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
  onNext
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [composing, setComposition] = useState(false);
  const startComposition = () => setComposition(true);
  const endComposition = () => setComposition(false);

  const [inputTag, setInputTag] = useState('');
  const [deleteAssetTagId, setDeleteAssetTagId] = useState('');

  // console.log(`CGAssetFormInput1 form.getValues("assetTags"): ${JSON.stringify(form.getValues("assetTags"))}`);
  const onSubmitFormInput1 = () => {
    if (cgAsset) {
      form.setValue("submitFormInput", 1);
    }
    form.handleSubmit(onSubmit)();
  }

  const onTagDelete = () => {
    const newValue = [...form.getValues('assetTags')
      .filter((current) => current.id !== deleteAssetTagId)
    ];
    form.setValue("assetTags", [...newValue]);

    setOpen(false);
  }

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
                <h2>アセットタイトル</h2>
                <FormField
                  control={form.control}
                  name="asset_name"
                  render={({ field }) => (
                    <FormItem
                      style={{
                        width: '45vw'
                      }}
                    >
                      <Input
                        id="assets-title"
                        htmlName="assets-title"
                        disabled={loading}
                        placeholder="SHIELD_Quinjet"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="">
                  <CGAssetPreviewDialog
                    form={form}
                    disabled={loading}
                    assetCates={assetCates}
                    registrantAffiliations={registrantAffiliations}
                    viewingRestrictions={viewingRestrictions}
                    broadcastingRights={broadcastingRights}
                    sharedAreas={sharedAreas}
                    uploadDirs={uploadDirs}
                  />
                </div>
              </div>
              <div className="registration__maincon">
                <div className="registration__maincon-left">
                  <h2>アセットタイトル</h2>
                  <dl>
                    <dt>アセットID</dt>
                    <dd>
                      <p className="asset-id">
                        <FormField
                          control={form.control}
                          name="asset_id"
                          render={({ field }) => (
                            <Input
                              disabled={true}
                              placeholder="（自動採番）"
                              {...field}
                            />
                          )}
                        />
                      </p>
                    </dd>
                    <dt>アセット種別</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="assetCateId"
                        render={({ field }) => (
                          <FormItem>
                            <select
                              name="assets__type"
                              className="assets-pulldown"
                              disabled={loading}
                              onChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <option hidden className="first"></option>
                              {assetCates && assetCates.map((assetCate) => (
                                <option
                                  key={assetCate.id}
                                  value={assetCate.id}
                                  selected={field.value === assetCate.id ? true : false}
                                >
                                  {assetCate.desc}
                                </option>
                              ))}
                            </select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                    <dt>ジャンル</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="asset_genre"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              id="assets-input01"
                              htmlName="assets__genre"
                              className="assets-input"
                              disabled={loading}
                              placeholder="都市、ビル"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                    <dt>制作ソフトウェア</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="asset_app_prod"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              id="assets-input02"
                              htmlName="assets__soft"
                              className="assets-input"
                              disabled={loading}
                              placeholder="Maya 2022"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                    <dt>形式</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="asset_format"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              id="assets-input03"
                              htmlName="assets__format"
                              className="assets-input"
                              disabled={loading}
                              placeholder="MayaBinary"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                    <dt>ファイルサイズ</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="asset_size"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              id="assets-input04"
                              htmlName="assets__size"
                              className="assets-input"
                              disabled={loading}
                              placeholder="235MB"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                    <dt>レンダラ</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="asset_renderer"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              id="assets-input05"
                              htmlName="assets__renderer"
                              className="assets-input"
                              disabled={loading}
                              placeholder="Arnold"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                    <dt>番組ID</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="program_id"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              id="assets-input06"
                              htmlName="assets__program-id"
                              className="assets-input"
                              disabled={loading}
                              placeholder="2300-456"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                    <dt>番組名</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="program_name"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              id="assets-input07"
                              htmlName="assets__program-name"
                              className="assets-input"
                              disabled={loading}
                              placeholder="Nスペ「恐竜」"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                    <dt>登録者所属</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="registrantAffiliationId"
                        render={({ field }) => (
                          <FormItem>
                            <select
                              name="assets__affiliation"
                              className="assets-pulldown"
                              disabled={loading}
                              onChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <option hidden className="first"></option>
                              {registrantAffiliations && registrantAffiliations.map((registrantAffiliation) => (
                                <option
                                  key={registrantAffiliation.id}
                                  value={registrantAffiliation.id}
                                  selected={field.value === registrantAffiliation.id ? true : false}
                                >
                                  {registrantAffiliation.desc}
                                </option>
                              ))}
                            </select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                    <dt>公開</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="sharedAreaId"
                        render={({ field }) => (
                          <FormItem>
                            <div className="radio_box">
                              {sharedAreas && sharedAreas.map((sharedArea) => (
                                <label key={sharedArea.id}>
                                  <input
                                    type="radio"
                                    name="release"
                                    disabled={loading}
                                    onChange={field.onChange}
                                    value={sharedArea.id}
                                    checked={field.value === sharedArea.id ? true : false}
                                  />
                                  {sharedArea.desc}
                                </label>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* <div className="radio_box">
                            <label><input type="radio" name="release" />一般公開可</label>
                            <label><input type="radio" name="release" />一般公開不可</label>
                          </div> */}
                    </dd>
                    <dt>観覧権限</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="viewingRestrictionId"
                        render={({ field }) => (
                          <FormItem>
                            <div className="radio_box">
                              {viewingRestrictions && viewingRestrictions.map((viewingRestriction) => (
                                <label key={viewingRestriction.id}>
                                  <input
                                    type="radio"
                                    name="privileges"
                                    disabled={loading}
                                    onChange={field.onChange}
                                    value={viewingRestriction.id}
                                    checked={field.value === viewingRestriction.id ? true : false}
                                  />
                                  {viewingRestriction.desc}
                                </label>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* <div className="radio_box">
                            <label><input type="radio" name="privileges" />制限なし</label>
                            <label><input type="radio" name="privileges" />グループのみ</label>
                            <label><input type="radio" name="privileges" />登録者のみ</label>
                          </div> */}
                    </dd>
                    <dt>放送権利</dt>
                    <dd>
                      <FormField
                        control={form.control}
                        name="broadcastingRightId"
                        render={({ field }) => (
                          <FormItem>
                            <select
                              name="assets__affiliation"
                              className="assets-pulldown"
                              disabled={loading}
                              onChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <option hidden className="first"></option>
                              {broadcastingRights && broadcastingRights.map((broadcastingRight) => (
                                <option
                                  key={broadcastingRight.id}
                                  value={broadcastingRight.id}
                                  selected={field.value === broadcastingRight.id ? true : false}
                                >
                                  {broadcastingRight.desc}
                                </option>
                              ))}
                            </select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                    <dt className="areamax">権利使用条件</dt>
                    <dd className="areamax">
                      <FormField
                        control={form.control}
                        name="rights_supplement"
                        render={({ field }) => (
                          <FormItem>
                            <Textarea
                              id="conditions"
                              htmlName="conditions"
                              rows={5}
                              // cols={33}
                              className="assets-textarea"
                              disabled={loading}
                              placeholder="権利使用条件"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                    <dt className="areamax">アセット詳細説明</dt>
                    <dd className="areamax">
                      <FormField
                        control={form.control}
                        name="asset_detail"
                        render={({ field }) => (
                          <FormItem>
                            <Textarea
                              id="explanation"
                              htmlName="explanation"
                              rows={5}
                              // cols={33}
                              className="assets-textarea"
                              disabled={loading}
                              placeholder="アセット詳細説明"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </dd>
                  </dl>
                </div>
                <div className="registration__maincon-right">
                  <div className="registration__maincon-upload">
                    <FormField
                      control={form.control}
                      name="assetUploads"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload
                              glacier={false}
                              value={field.value as UploadFileProps[]}
                              disabled={loading}
                              onChange={({
                                file_name,
                                url,
                                file_path
                              }) => field.onChange([...field.value, {
                                file_name,
                                url,
                                file_path
                              }])}
                              onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                              poster="/images/asset_3dcg.png"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="registration__maincon-tumb">
                    <FormField
                      control={form.control}
                      name="assetThumbs"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUpload
                              glacier={false}
                              value={field.value as UploadImageProps[]}
                              disabled={loading}
                              onChange={({
                                thumb_file_name,
                                thumb_url,
                                thumb_file_path
                              }) => field.onChange([...field.value, {
                                thumb_file_name,
                                thumb_url,
                                thumb_file_path
                              }])}
                              onRemove={(thumb_url) => field.onChange([...field.value.filter((current) => current.thumb_url !== thumb_url)])}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* <div className="registration__maincon-tag">
                    <h2>アップロード場所</h2>
                    <FormField
                      control={form.control}
                      name="uploadDirId"
                      render={({ field }) => (
                        <FormItem>
                          <select
                            name="assets__uploaddir"
                            className="my-assets-pulldown-upload-dir"
                            disabled={loading}
                            onChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                            placeholder="アップロード場所を選択"
                          >
                            <option hidden className="first"></option>
                            {uploadDirs && uploadDirs.map((uploadDir) => (
                              <option
                                key={uploadDir.id}
                                value={uploadDir.id}
                                selected={field.value === uploadDir.id ? true : false}
                              >
                                {uploadDir.base_path}
                              </option>
                            ))}
                          </select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}
                  <div className="registration__maincon-tag">
                    <h2>タグ</h2>
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
                    <button className="edit" type="button" onClick={form.handleSubmit(onNext)}>ユーザーコメント・タグ編集<Image
                      src="/assets/images/edit_arrow.svg" className="arrow" width="8" height="12" decoding="async"
                      alt="矢印" /></button>
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
                      className={cn(
                        'btn',
                        loading && 'opacity-50'
                      )}
                      style={loading ? { cursor: 'default' } : { cursor: 'pointer' }}
                      onClick={form.handleSubmit(onSubmitFormInput1)}
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
                  <div className="togglebox">
                    <p>公開</p>

                    <div className={cn(
                      'toggle_button',
                      loading && 'opacity-50'
                    )}>
                      <FormField
                        control={form.control}
                        name="valid_flg"
                        render={({ field }) => (
                          <input
                            id="toggle"
                            className="toggle_input"
                            type='checkbox'
                            checked={field.value}
                            onChange={field.onChange}
                            disabled={loading}
                            style={loading ? { cursor: 'default' } : { cursor: 'pointer' }}
                          />
                        )}
                      />
                      <label htmlFor="toggle" className="toggle_label" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="registration__sidelog">
                <h2>更新ログ</h2>
                <ul className="detail__sideloglist">
                  {cgAsset?.revisionHistories && cgAsset.revisionHistories?.map((elem: CgaRevisionHistory | null) => {

                    if (elem) {
                      return <li key={elem.id} className="">
                        <span>{dateFormat(elem.created_at, 'yyyy.MM.dd')}</span>
                        <p>{elem.desc.split("\n").map((item, index) => {
                          return (
                            <Fragment key={index}>{item}<br /></Fragment>
                          );
                        })}</p>
                        {/* <p>{elem.revisedUser?.name}</p> */}
                      </li>
                    }
                  })}
                </ul>
              </div>
              <div className="registration__sidelog">
                <h2>更新ログ記入</h2>
                <div className="">
                  <FormField
                    control={form.control}
                    name="revision_history"
                    render={({ field }) => (
                      <FormItem
                        style={{ width: '100%' }}
                      >
                        <FormControl>
                          <Textarea
                            disabled={loading}
                            placeholder="修正した内容を記述"
                            className="my-assets-textarea-log"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <a
              onClick={() => router.push(`/${(
                params.cgAssetSlug[0] !== CGAssetPageSlug.New ?
                  "c_g_assets/" + params.cgAssetSlug[0] :
                  ""
              )}`)}
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
