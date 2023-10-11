"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { ClientSafeProvider, LiteralUnion, getProviders, signOut, useSession } from "next-auth/react"
import { BuiltInProviderType } from "next-auth/providers";
import { Button } from "@/components/ui/button";

const SignOut = () => {
  const router = useRouter();

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

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {providers && Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <Button
            onClick={() => signOut()}
          >
            {provider.name} からサインアウト
          </Button>
        </div>
      ))}
    </>
  )
}

export default SignOut;