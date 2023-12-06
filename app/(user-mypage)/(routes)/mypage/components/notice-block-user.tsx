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

export default NoticeBlockUser