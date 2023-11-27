"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { ClientSafeProvider, LiteralUnion, getProviders, signIn, useSession } from "next-auth/react"
import { BuiltInProviderType } from "next-auth/providers";
import { LogIn } from "lucide-react";

import { useCgAssetsSearchForm } from "@/hooks/use-cgassets-search-form";
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
  const storeSearchInfo = useCgAssetsSearchForm();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    (async () => {
      const _providers = await getProviders();
      setProviders(_providers)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (session) {
    router.push(`/c_g_assets`);
  }

  if (!isMounted || session) {
    return null;
  }

  const onSignIn = (providerId: LiteralUnion<BuiltInProviderType>) => {
    setLoading(true);

    signIn(providerId);
    storeSearchInfo.resetCgAssetsSearchFormData()

    setLoading(false);
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
              disabled={loading}
              size="lg"
              onClick={() => onSignIn(provider.id)}
            >
              <LogIn className="mr-2 h-4 w-4" /> {provider.name} でサインイン
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}

export default SignIn;