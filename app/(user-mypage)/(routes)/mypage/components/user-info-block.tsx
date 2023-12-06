"use client"

import { useSession } from "next-auth/react";

const UserInfoBlock = () => {
  const { data: session, status } = useSession()

  return (
    <>
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        <i className="title_icon" />
        ユーザ情報
      </div>
      <div className="flex-grow h-full overflow-y-auto">
        <div className="mt-6">
          Oktaユーザ名: {session?.user?.name}
        </div>
        <div className="mt-6">
          メールアドレス: {session?.user?.email}
        </div>
        <div className="mt-6">
          主所属名: {session?.user && (session?.user as { rgstAffiDesc: string }).rgstAffiDesc}
        </div>
        <div className="mt-6">
          主所属コード: {session?.user && (session?.user as { rgstAffiCode: string }).rgstAffiCode}
        </div>
        <div className="mt-6">
          CGアセットストア ロール: {session?.user && (session?.user as { roleDesc: string }).roleDesc}
        </div>
      </div>
    </>
  )
}

export default UserInfoBlock