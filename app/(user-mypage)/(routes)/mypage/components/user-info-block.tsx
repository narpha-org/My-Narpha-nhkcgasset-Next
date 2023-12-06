"use client"

import { useSession } from "next-auth/react";

const UserInfoBlock = () => {
  const { data: session, status } = useSession()

  return (
    <>
      <div className="mypage__userinfo">
        <h2 className="mypage__title">ユーザー情報</h2>
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
    </>
  )
}

export default UserInfoBlock