"use client"

import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { X, Save, Check } from "lucide-react"
// import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react";

import {
  ApplyDownload,
  CgAsset,
  User,
} from "@/graphql/generated/graphql";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form-raw"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/text-area"
import { DatePicker } from "@/components/ui/date-picker"

import { CGAssetPageProps, CGAssetPageSlug } from "../page-slug"
import { getAssetMedias } from "../page-detail/asset-media";
// import { ApplyDownloadFormSchema, ApplyDownloadFormValues } from "./apply-download-form"

interface CGAssetApplyDownloadApplyFormInputProps {
  form: UseFormReturn<any>;
  initialData: ApplyDownload | null;
  cgAsset: CgAsset | null;
  manageUsers: User[] | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    cgAssetSlug: string[];
  };
  loading: boolean;
  onNext: () => void;
};

export const CGAssetApplyDownloadApplyFormInput: React.FC<CGAssetApplyDownloadApplyFormInputProps> = ({
  form,
  initialData,
  cgAsset,
  manageUsers,
  setDialogOpen,
  params,
  loading,
  onNext
}) => {
  // const params = useParams() as unknown as CGAssetPageProps['params'];
  // const router = useRouter();
  // console.log(`manageUsers: ${JSON.stringify(manageUsers)}`)
  const { data: session, status } = useSession()

  const { mediaDesc, medias, notFound } = getAssetMedias(cgAsset as CgAsset);

  return (
    <div className="maincon">
      <div className="applypage flex flex-row space-x-4">
        <div className="basis-1/3">
          <div className="flex flex-col space-y-4">
            <div className="applypage__info rounded-lg border-2 border-slate-400/50 p-6">
              <h2 className="applypage__title">申請先設定</h2>
              <ul>
                <li>
                  <FormField
                    control={form.control}
                    name="manage_user_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><h3>番組責任者</h3></FormLabel>
                        <p>
                          <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue defaultValue={field.value} placeholder="申請先の番組責任者を選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {manageUsers && manageUsers.map((manageUser) => (
                                <SelectItem key={manageUser.id} value={manageUser.id}>{manageUser.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </p>
                      </FormItem>
                    )}
                  />
                </li>
              </ul>
            </div>
            <div className="applypage__info rounded-lg border-2 border-slate-400/50 p-6">
              <h2 className="applypage__title">ユーザ情報</h2>
              <ul>
                <li>
                  <h3>Oktaユーザ名</h3>
                  <p>{session?.user?.name}</p>
                </li>
                <li>
                  <h3>メールアドレス</h3>
                  <p>{session?.user?.email}</p>
                </li>
                <li>
                  <h3>主所属名</h3>
                  <p>{session?.user && (session?.user as { rgstAffiDesc: string }).rgstAffiDesc}</p>
                </li>
                <li>
                  <h3>主所属コード</h3>
                  <p>{session?.user && (session?.user as { rgstAffiCode: string }).rgstAffiCode}</p>
                </li>
                <li>
                  <h3>CGアセットストアロール</h3>
                  <p>{session?.user && (session?.user as { roleDesc: string }).roleDesc}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="basis-1/3">
          <div className="flex flex-col space-y-4">
            <div className="applypage__info rounded-lg border-2 border-slate-400/50 p-6">
              <h2 className="applypage__title">利用目的</h2>
              <ul>
                <li>
                  <FormField
                    control={form.control}
                    name="program_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><h3>番組ID</h3></FormLabel>
                        <p>
                          <FormControl>
                            <Input disabled={loading} placeholder="2300-456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </p>
                      </FormItem>
                    )}
                  />
                </li>
                <li>
                  <FormField
                    control={form.control}
                    name="program_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><h3>番組名</h3></FormLabel>
                        <p>
                          <FormControl>
                            <Input disabled={loading} placeholder="Nスペ「恐竜」" {...field} />
                          </FormControl>
                          <FormMessage />
                        </p>
                      </FormItem>
                    )}
                  />
                </li>
                <li>
                  <h3>利用期間</h3>
                  <p>
                    <FormField
                      control={form.control}
                      name="date_usage_start"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <DatePicker
                              date={field.value}
                              setDate={(date) => form.setValue("date_usage_start", date)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    -
                    <FormField
                      control={form.control}
                      name="date_usage_end"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <DatePicker
                              date={field.value}
                              setDate={(date) => form.setValue("date_usage_end", date)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </p>
                </li>
                <li>
                  <FormField
                    control={form.control}
                    name="purpose_of_use_txt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><h3>利用目的</h3></FormLabel>
                        <p>
                          <FormControl>
                            <Textarea
                              disabled={loading}
                              placeholder="利用目的"
                              className="h-80"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </p>
                      </FormItem>
                    )}
                  />
                </li>
                <li>
                  <FormField
                    control={form.control}
                    name="etc_txt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><h3>その他</h3></FormLabel>
                        <p>
                          <FormControl>
                            <Textarea
                              disabled={loading}
                              placeholder="その他"
                              className="h-60"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </p>
                      </FormItem>
                    )}
                  />
                </li>
              </ul>
            </div>
            {/* <div className="applypage__info rounded-lg border-2 border-slate-400/50 p-6">
                <h2 className="applypage__title">データ削除</h2>
              </div> */}
          </div>
        </div>
        <div className="basis-1/3">
          <div className="flex flex-col space-y-4">
            <div className="applypage__info rounded-lg border-2 border-slate-400/50 p-6">
              <h2 className="applypage__title">アセット情報</h2>
              <div className="mainbox">
                {medias ? (
                  <>
                    {/* <div style={{ width: "500", height: "276", position: "relative" }}> */}
                    <span className="mainbox__category">{mediaDesc}</span>
                    <Image
                      src={(medias && medias[0] ? medias[0].thumb_url as string : notFound)}
                      alt={cgAsset?.asset_id as string}
                      width={360}
                      height={203}
                      decoding="async"
                    />
                    {/* <p>{cgAsset?.asset_name}</p> */}
                    {/* <p style={{ position: "absolute", top: "9.3rem", left: "0.6rem", width: "19.0rem", textAlign: "right", zIndex: 40, color: "white", textShadow: "1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000", height: "2.0rem" }}>DL数:{elem.download_count}</p>
                      </div> */}
                  </>
                ) : cgAsset?.asset_id}
              </div>
              <dl>
                <dt>アセットID</dt>
                <dd>{cgAsset?.asset_id ?? "--"}</dd>
                <dt>アセット種別</dt>
                <dd>{cgAsset?.assetCate?.desc ?? "--"}</dd>
                <dt>ジャンル</dt>
                <dd>{cgAsset?.asset_genre ?? "--"}</dd>
                <dt>制作ソフトウェア</dt>
                <dd>{cgAsset?.asset_app_prod ?? "--"}</dd>
                <dt>形式</dt>
                <dd>{cgAsset?.asset_format ?? "--"}</dd>
                <dt>ファイルサイズ</dt>
                <dd>{cgAsset?.asset_size ?? "--"}</dd>
                <dt>レンダラ</dt>
                <dd>{cgAsset?.asset_renderer ?? "--"}</dd>
                <dt>番組ID</dt>
                <dd>{cgAsset?.program_id ?? "--"}</dd>
                <dt>番組名</dt>
                <dd>{cgAsset?.program_name ?? "--"}</dd>
                <dt>登録者所属</dt>
                <dd>{cgAsset?.userCreate.registrantAffiliation?.desc ?? "--"}</dd>
                <dt>公開範囲</dt>
                <dd>{cgAsset?.sharedArea?.desc ?? "--"}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <div>
          <Button disabled={loading} className="ml-auto mr-2" variant="outline" type="button"
            onClick={() => setDialogOpen(false)}>
            <X className="mr-2 h-4 w-4" /> 閉じる
          </Button>
        </div>
        <div>
          <Button disabled={loading} className="ml-auto" type="button" onClick={form.handleSubmit(onNext)}>
            {initialData ? <Save className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />} 確認
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CGAssetApplyDownloadApplyFormInput