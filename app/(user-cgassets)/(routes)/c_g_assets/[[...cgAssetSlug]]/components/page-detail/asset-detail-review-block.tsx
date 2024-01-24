"use client";

import { Fragment, useRef, useState, useEffect } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { Plus } from "lucide-react";
// import classNames from 'classnames';

import { apolloClient } from '@/lib/apollo-client';
import { FetchResult } from '@apollo/client';
import {
  CgAsset,
  CgAssetReview,
  DeleteCgAssetReviewMutation,
  DeleteCgAssetReviewDocument,
} from "@/graphql/generated/graphql";
import { Button } from '@/components/ui/button-raw';
import { AlertModal } from '@/components/modals/alert-modal';
import styles from "@/styles/components/cgasset-detail.module.css";

import AssetDetailReviewDialog from './asset-detail-review-dialog';

interface AssetDetailReviewBlockProps {
  cgAsset: CgAsset;
}

const AssetDetailReviewBlock: React.FC<AssetDetailReviewBlockProps> = ({
  cgAsset
}) => {
  const [isClosed, setIsClosed] = useState(false)
  const [childHeight, setChildHeight] = useState('')
  const refChild = useRef<HTMLDivElement>(null)

  const router = useRouter();
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteCgAssetReviewId, setDeleteCgAssetReviewId] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    if (refChild.current) {
      setChildHeight(refChild.current.style.height);
    }

    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async () => {
    try {
      setLoading(true);

      const ret: FetchResult<DeleteCgAssetReviewMutation>
        = await apolloClient
          .mutate({
            mutation: DeleteCgAssetReviewDocument,
            variables: {
              id: deleteCgAssetReviewId,
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

      router.refresh();
      toast.success('コメントが削除されました。');
    } catch (error: any) {
      toast.error('削除できません。');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  const handleClickFilter = (event) => {
    setIsClosed((_isClosed) => !_isClosed)

    if (isClosed) {
      if (refChild.current) {
        refChild.current.style.visibility = 'visible';
        refChild.current.style.height = 'auto';
        refChild.current.style.marginTop = '0.78125vw';
        refChild.current.style.padding = '1.0416666667vw 1.3020833333vw 0.78125vw';
      }
    } else {
      setTimeout(() => {
        if (refChild.current) {
          refChild.current.style.visibility = 'hidden';
          refChild.current.style.height = '0';
          refChild.current.style.marginTop = '0';
          refChild.current.style.padding = '0';
        }
      }, 200);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        title={deleteConfirmText}
      />
      <div className="detail__textbox">
        <h2>コメント</h2>
        <div ref={refChild} className={`${styles.childItem}`} style={{
          top: isClosed ? `-10vh` : '0',
          opacity: isClosed ? 0 : 1,
        }}>
          {cgAsset.reviews?.map((elem: CgAssetReview | null) => {

            if (elem && elem.valid_flg === true) {
              return <div key={elem.id} className="txt">
                {session?.user && elem.reviewedUser?.id === (session?.user as { userId: string }).userId &&
                  <div className="toggle_button_box">
                    <AssetDetailReviewDialog
                      id="tag_gray-btn01"
                      className="tag_gray"
                      cgAssetReviewId={elem.id}
                      cgAsset={cgAsset}
                      isClosed={isClosed}
                      action={"編集"}
                    />
                    <Button
                      id="tag_gray-btn01"
                      className="tag_gray"
                      disabled={loading}
                      type="button"
                      onClick={() => {
                        setDeleteCgAssetReviewId(() => elem.id);
                        setDeleteConfirmText(() => `このコメント削除を実行してよろしいですか？`);
                        setOpen(true);
                      }}
                    >
                      削除
                    </Button>
                  </div>
                }
                <p>{elem.review.split("\n").map((item, index) => {
                  return (
                    <Fragment key={index}>{item}<br /></Fragment>
                  );
                })}</p>
              </div>
            }

          })}
        </div>
        <div className="flex justify-center" style={{
          width: '15rem',
          margin: '0 auto'
        }}>
          <button className="detail__closebtn"
            onClick={handleClickFilter}
            style={{ cursor: 'pointer' }}
          >{isClosed ?
            <>Open <Plus className="h-4 w-4" /></> :
            <>Close <Image src="/assets/images/close.svg" width="8"
              height="8" decoding="async" alt="close" /></>
            }</button>
          <AssetDetailReviewDialog
            id={undefined}
            className="detail__closebtn"
            cgAssetReviewId={null}
            cgAsset={cgAsset}
            isClosed={isClosed}
            action={"Add"}
          />
        </div>
      </div >
    </>
  )
}

export default AssetDetailReviewBlock