"use client";

import { useState } from "react"
import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal"

// ログインボタン
export const LoginButton = () => {
  return (
    <Button
      style={{ marginRight: 10 }}
      onClick={() => signIn()}
    >
      Okta ログイン
    </Button>
  );
};

// ログアウトボタン
export const LogoutButton = (props: { session: Session | null }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignOut = () => {
    setLoading(true);

    signOut();

    toast.success('ログアウトました。');

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
        style={{ marginRight: 0 }
        }
        onClick={() => setOpen(true)}
      >
        {props.session?.user?.name}さん
      </Button >
    </>
  );
};