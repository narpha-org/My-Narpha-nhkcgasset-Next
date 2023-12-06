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
import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/modals/alert-modal';
import NoticeBlockDialog from './notice-block-dialog';

interface NoticeBlockManagerProps {
  systemNotices: SystemNotice[]
}

const NoticeBlockManager: React.FC<NoticeBlockManagerProps> = ({
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
      <div className="mypage__maincon-news">
        <h2 className="mypage__title">お知らせ</h2>
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
                </div>
              </>
            }
          })}
        </div>
      </div>
    </>
  )
}

export default NoticeBlockManager