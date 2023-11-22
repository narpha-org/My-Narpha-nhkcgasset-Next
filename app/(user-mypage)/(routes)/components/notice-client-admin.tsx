"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { apolloClient } from "@/lib/apollo-client";
import { ApolloQueryResult } from "@apollo/client";
import {
  GetSystemNoticeQuery,
  GetSystemNoticeDocument,
  SystemNotice,
} from "@/graphql/generated/graphql";
import { Loader } from "@/components/ui/loader";

import NoticeClientAdminForm from "./notice-client-admin-form";

interface NoticeClientAdminProps {
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  params: {
    systemNoticeId: string;
  };
};

const NoticeClientAdmin: React.FC<NoticeClientAdminProps> = ({ params, setDialogOpen }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [SystemNotice, setSystemNotice] = useState<SystemNotice | null>(null);

  useEffect(() => {

    (async () => {
      if (isMounted) {
        return;
      }

      if (
        !params ||
        !params.systemNoticeId
      ) {
        /* 不正パラメータ */
        setIsMounted(true);
        return
      }

      const ret: ApolloQueryResult<GetSystemNoticeQuery>
        = await apolloClient
          .query({
            query: GetSystemNoticeDocument,
            variables: {
              id: params.systemNoticeId
            },
          });
      setSystemNotice(ret.data.SystemNotice as SystemNotice);

      setIsMounted(true);
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <NoticeClientAdminForm
          initialData={SystemNotice}
          setDialogOpen={setDialogOpen}
          params={params}
        />
      </div>
    </div>
  );
}

export default NoticeClientAdmin;
