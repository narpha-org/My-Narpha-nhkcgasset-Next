"use client";

import { Fragment } from "react";
import { format } from 'date-fns'

import {
  SystemNotice,
} from "@/graphql/generated/graphql";

interface NoticeBlockUserProps {
  systemNotices: SystemNotice[]
}

const NoticeBlockUser: React.FC<NoticeBlockUserProps> = ({
  systemNotices
}) => {

  return (
    <>
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        <i className="title_icon" />
        お知らせ
      </div>
      <div className="flex-grow h-full overflow-y-auto">
        {systemNotices?.map((elem: SystemNotice | null) => {

          if (elem) {
            return <div key={elem.id} className="flex flex-col mb-10">
              <div className="">{format(new Date(elem.notice_date), "yyyy/MM/dd")}</div>
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

export default NoticeBlockUser