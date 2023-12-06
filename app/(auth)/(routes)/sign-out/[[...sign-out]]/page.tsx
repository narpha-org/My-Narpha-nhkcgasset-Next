"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { ClientSafeProvider, LiteralUnion, getProviders, signOut, useSession } from "next-auth/react"
import { BuiltInProviderType } from "next-auth/providers";
import { LogOut } from "lucide-react";

import { useCgAssetsSearchForm } from "@/hooks/use-cgassets-search-form";
import { Button } from "@/components/ui/button";

const SignOut = () => {
  const router = useRouter();

  const { data: session, status } = useSession()
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null)
  const storeSearchInfo = useCgAssetsSearchForm();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    (async () => {
      const _providers = await getProviders();
      setProviders(_providers)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!session || !session?.user || !session?.user.name) {
    // router.push(`/`);
  }

  if (!isMounted || !session) {
    return null;
  }

  return (
    <>
      {providers && Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <Button
            size="lg"
            onClick={() => signOut().then(async () => {
              storeSearchInfo.resetCgAssetsSearchFormData()

              if (!process.env.OKTA_LOGOUT) {
                return;
              }
              return (window.location.href =
                process.env.OKTA_LOGOUT +
                '?' + 'id_token_hint=' + (session as unknown as { idToken: string }).idToken +
                '&' + 'post_logout_redirect_uri=' + encodeURIComponent(process.env.NEXTAUTH_URL as string)
              );
            })}
          >
            <LogOut className="mr-2 h-4 w-4" /> {provider.name} からサインアウト
          </Button>
        </div >
      ))}
    </>
  )
}

export default SignOut;