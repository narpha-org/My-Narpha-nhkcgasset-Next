"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast"
import { format } from 'date-fns'

import { apolloClient } from '@/lib/apollo-client';
import { FetchResult } from '@apollo/client';
import {
  DeleteSystemNoticeMutation,
  DeleteSystemNoticeDocument,
  SystemNotice,
} from "@/graphql/generated/graphql";
import { Button } from '@/components/ui/button-raw';
import { AlertModal } from '@/components/modals/alert-modal';
import NoticeBlockDialog from './notice-block-dialog';

interface NoticeBlockAdminProps {
  systemNotices: SystemNotice[]
}

const NoticeBlockAdmin: React.FC<NoticeBlockAdminProps> = ({
  systemNotices
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteSystemNoticeId, setDeleteSystemNoticeId] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    setLoading(false)
  }, [])

  const onDelete = async () => {
    try {
      setLoading(true);

      const ret: FetchResult<DeleteSystemNoticeMutation>
        = await apolloClient
          .mutate({
            mutation: DeleteSystemNoticeDocument,
            variables: {
              id: deleteSystemNoticeId,
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
      toast.success('お知らせが削除されました。');
    } catch (error: any) {
      toast.error('削除できません。');
    } finally {
      setLoading(false);
      setOpen(false);
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
      <div className="mypage__maincon-news">
        <h2 className="mypage__title">お知らせ<NoticeBlockDialog
          id={undefined}
          className="select"
          systemNoticeId={null}
          action={"新規作成"}
        /></h2>
        <div className="mypage__news">
          {systemNotices?.map((elem: SystemNotice | null) => {

            if (elem) {
              return <>
                <div key={elem.id} className="mypage__news-box">
                  <p>
                    <span>{format(new Date(elem.notice_date), "yyyy年MM月dd日")}</span>{elem.message?.split("\n").map((item, index) => {
                      return (
                        <Fragment key={index}>{item}<br /></Fragment>
                      );
                    })}
                  </p>
                  <div className="toggle_button_box">
                    <NoticeBlockDialog
                      id="tag_gray-btn01"
                      className="tag_gray"
                      systemNoticeId={elem.id}
                      action={"編集"}
                    />
                    <Button
                      id="tag_gray-btn01"
                      className="tag_gray"
                      disabled={loading}
                      type="button"
                      onClick={() => {
                        setDeleteSystemNoticeId(() => elem.id);
                        setDeleteConfirmText(() => `このお知らせ削除を実行してよろしいですか？`);
                        setOpen(true);
                      }}
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </>
            }
          })}
        </div>
      </div>
    </>
  )
}

export default NoticeBlockAdmin