"use client";

import {
  SystemNotice,
} from "@/graphql/generated/graphql";

interface NoticeBlockProps {
  systemNotices: SystemNotice[]
}

const NoticeBlock: React.FC<NoticeBlockProps> = ({
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
              <div className="">{elem.created_at}</div>
              <div className="ml-2">{elem.message}</div>
              {/* <div>{elem.createUser?.name}</div> */}
            </div>
          }
        })}
      </div>
    </>
  )
}

export default NoticeBlock