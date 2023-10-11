"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { ClientSafeProvider, LiteralUnion, getProviders, signIn, useSession } from "next-auth/react"
import { BuiltInProviderType } from "next-auth/providers";
import { Button } from "@/components/ui/button";

interface SignInPageParams {
  params: {
    csrfToken: string
    callbackUrl: string
    email: string
    error: string
  }
  searchParams: unknown
}

const SignIn = ({ params, searchParams }: SignInPageParams) => {
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

  if (session) {
    router.push(`/`);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="card">
        {params.error && (
          <div className="error">
            <p>別アカウントでサインインをお願いします。</p>
          </div>
        )}
        {providers && Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <Button
              onClick={() => signIn(provider.id)}
            >
              {provider.name} でサインイン
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}

export default SignIn;