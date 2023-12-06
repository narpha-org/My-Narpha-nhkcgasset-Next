"use client";

import { useRouter, usePathname } from "next/navigation"
import Image from "next/image";
import { useSession } from "next-auth/react";
import classNames from "classnames";
import Link from "next/link";

import { IsRoleAdmin } from "@/lib/check-role-client";

interface NavSideboxCgAssetsProps {
  isNavSideboxClosed?: boolean;
}

export const NavHeaderMypage: React.FC<NavSideboxCgAssetsProps> = ({
  isNavSideboxClosed
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  let myButtons: JSX.Element;
  switch (pathname) {
    case '/registration/':

      myButtons = <button
        className="mypage"
        onClick={() => router.push(`/`)}
      ><Image src="/assets/images/home.svg" width="19" height="19" decoding="async"
        alt="home" />Asset Store</button>

      break;
    case '/mypage':

      if (IsRoleAdmin(session)) {

        myButtons = <button
          className="mypage"
          onClick={() => router.push(`/admin/`)}
        ><Image src="/assets/images/home.svg" width="19" height="19" decoding="async"
          alt="home" />管理TOP</button>

      } else {

        myButtons = <button
          className="mypage"
          onClick={() => router.push(`/mypage`)}
        ><Image src="/assets/images/home.svg" width="19" height="19" decoding="async"
          alt="home" />マイページ</button>

      }

      break;
    default:

      myButtons = <button
        className="mypage"
        onClick={() => router.push(`/mypage`)}
      ><Image src="/assets/images/home.svg" width="19" height="19" decoding="async"
        alt="home" />マイページ</button>

      break;
  }

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <Link href={`/`}>
            <h1 className={classNames({
              "h1_main":
                true,
              "left": isNavSideboxClosed === true,
            })}>CG ASSET STORE</h1>
          </Link>
          {myButtons}
        </div>
      </header>
    </>
  )
}
