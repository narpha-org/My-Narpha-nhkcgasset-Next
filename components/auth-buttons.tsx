"use client";

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { toast } from "react-hot-toast"
import { LogIn, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal"

// ログインボタン
export const LoginButton = () => {
  const [loading, setLoading] = useState(false);

  const onSignIn = () => {
    setLoading(true);

    signIn();

    // toast.success('Oktaの認証画面に移動します。');

    setLoading(false);
  }

  return (
    <Button
      disabled={loading}
      style={{ marginRight: 10 }}
      onClick={onSignIn}
    >
      <LogIn className="mr-2 h-4 w-4" /> Okta ログイン
    </Button>
  );
};

// ログアウトボタン
export const LogoutButton = (props: { session: Session | null }) => {
  const { data: session, status } = useSession()

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignOut = () => {
    setLoading(true);

    signOut().then(() => {
      if (!process.env.OKTA_LOGOUT) {
        return;
      }
      return (window.location.href =
        process.env.OKTA_LOGOUT +
        '?' + 'id_token_hint=' + (session as unknown as { idToken: string }).idToken +
        '&' + 'post_logout_redirect_uri=' + encodeURIComponent(process.env.NEXTAUTH_URL as string)
      );
    });

    // toast.success('ログアウトました。');

    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onSignOut}
        loading={loading}
        title="ログアウトしますか？"
        description="再度Oktaでの認証が必要になります。"
      />
      < Button
        variant="ghost"
        disabled={loading}
        style={{ marginRight: 0 }
        }
        onClick={() => setOpen(true)}
      >
        <LogOut className="mr-2 h-4 w-4" /> {props.session?.user?.name}さん
      </Button >
    </>
  );
};