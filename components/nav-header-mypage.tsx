"use client";

import { useRouter, usePathname } from "next/navigation"
import Image from "next/image";
import classNames from "classnames";

interface NavSideboxCgAssetsProps {
  isNavSideboxClosed?: boolean;
}

export const NavHeaderMypage: React.FC<NavSideboxCgAssetsProps> = ({
  isNavSideboxClosed
}) => {
  const router = useRouter();
  const pathname = usePathname();


  let myButtons: JSX.Element;
  switch (pathname) {
    case '/registration/':

      myButtons = <button
        className="mypage"
        onClick={() => router.push(`/c_g_assets`)}
      ><Image src="/assets/images/home.svg" width="19" height="19" decoding="async"
        alt="home" />Asset Store</button>

      break;
    default:

      myButtons = <button
        className="mypage"
        onClick={() => router.push(`/`)}
      ><Image src="/assets/images/home.svg" width="19" height="19" decoding="async"
        alt="home" />マイページ</button>

      break;
  }

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <h1 className={classNames({
            "h1_main":
              true,
            "left": isNavSideboxClosed === true,
          })}>CG ASSET STORE</h1>
          {myButtons}
        </div>
      </header>
    </>
  )
}
