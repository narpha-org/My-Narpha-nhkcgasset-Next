"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useSearchForm } from "@/hooks/use-search-form";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

interface DashboardClientProps {
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ }) => {
  const params = useParams();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  const storeSearchInfo = useSearchForm();

  useEffect(() => {
    setIsMounted(true);

    (async () => {
      storeSearchInfo.resetSearchFormData()
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="ダッシュボード" description="概要 - CGアセット管理" />
      </div>
      <Separator />
    </>
  );
};
