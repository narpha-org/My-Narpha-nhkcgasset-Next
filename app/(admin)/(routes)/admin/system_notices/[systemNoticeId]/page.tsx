import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetSystemNoticeQuery,
  GetSystemNoticeDocument,
  SystemNotice,
} from "@/graphql/generated/graphql";

import { SystemNoticeForm } from "./components/system_notices-form";

const SystemNoticePage = async ({
  params
}: {
  params: { systemNoticeId: string }
}) => {
  const ret: ApolloQueryResult<GetSystemNoticeQuery>
    = await apolloServer()
      .query({
        query: GetSystemNoticeDocument,
        variables: {
          id: params.systemNoticeId
        },
      });
  const SystemNotice = ret.data.SystemNotice as SystemNotice;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SystemNoticeForm initialData={SystemNotice} />
      </div>
    </div>
  );
}

export default SystemNoticePage;
