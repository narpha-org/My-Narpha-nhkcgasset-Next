"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast"
import { format } from 'date-fns'

import { apolloClient } from '@/lib/apollo-client';
import { FetchResult } from '@apollo/client';
import {
  DeleteSystemNoticeDocument,
  SystemNotice,
} from "@/graphql/generated/graphql";
import { Button } from '@/components/ui/button';
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

  useEffect(() => {
    setLoading(false)
  }, [])

  const onDelete = async () => {
    try {
      setLoading(true);

      const ret: FetchResult<{
        DeleteSystemNotice: SystemNotice;
      }> = await apolloClient
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
      />
      <div v-if="title" className="flex text-lg items-center justify-between mb-5">
        <div className="flex flex-row items-center">
          <div className="grow w-72">
            <i className="title_icon" />
            お知らせ
          </div>
          <div className="flex-auto w-32 mr-2">
            <NoticeBlockDialog
              systemNoticeId={null}
              action={"新規作成"}
              variant="default"
              size="sm"
            />
          </div>
        </div>
      </div>
      <div className="flex-grow h-full overflow-y-auto">
        {systemNotices?.map((elem: SystemNotice | null) => {

          if (elem) {
            return <div key={elem.id} className="flex flex-col mb-8">
              <div className="flex flex-row items-center mb-6">
                <div className="grow w-72">{format(new Date(elem.notice_date), "yyyy/MM/dd")}</div>
                <div className="flex-auto w-8">
                  <NoticeBlockDialog
                    systemNoticeId={elem.id}
                    action={"編集"}
                    variant="default"
                    size="icon"
                  />
                </div>
                <div className="flex-auto w-8 ml-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={loading}
                    className="ml-auto"
                    type="button"
                    onClick={() => {
                      setDeleteSystemNoticeId(elem.id);
                      setOpen(true);
                    }}
                  >
                    削除
                  </Button>
                </div>
              </div>
              <div className="ml-2">{elem.message?.split("\n").map((item, index) => {
                return (
                  <Fragment key={index}>{item}<br /></Fragment>
                );
              })}</div>
            </div>
          }
        })}
      </div>
    </>
  )
}

export default NoticeBlockAdmin