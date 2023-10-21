"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { ClientSafeProvider, LiteralUnion, getProviders, signOut, useSession } from "next-auth/react"
import { BuiltInProviderType } from "next-auth/providers";
import { LogOut } from "lucide-react";
// import { useOktaAuth } from '@okta/okta-react';
import { Button } from "@/components/ui/button";

const SignOut = () => {
  const router = useRouter();
  // const { oktaAuth } = useOktaAuth();

  const { data: session, status } = useSession()
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    (async () => {
      const _providers = await getProviders();
      setProviders(_providers)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!session) {
    router.push(`/`);
  }

  if (!isMounted || !session) {
    return null;
  }

  return (
    <>
      {providers && Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <Button
            onClick={() => signOut().then(async () => {
              // await oktaAuth.signOut();
              if (!process.env.OKTA_LOGOUT) {
                return;
              }
              return (window.location.href = process.env.OKTA_LOGOUT);
            })}
          >
            <LogOut className="mr-2 h-4 w-4" /> {provider.name} からサインアウト
          </Button>
        </div>
      ))}
    </>
  )
}

export default SignOut;