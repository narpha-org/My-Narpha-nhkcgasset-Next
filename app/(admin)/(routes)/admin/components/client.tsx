"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

interface AdminDashboardClientProps {
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ }) => {
  const params = useParams();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="管理ダッシュボード" description="管理TOP - CGアセット管理" />
      </div>
      <Separator />
    </>
  );
};
