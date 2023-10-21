import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  ApplyDownloadMailTpl,
  GetApplyDownloadMailTplDocument,
} from "@/graphql/generated/graphql";

import { ApplyDownloadMailTplForm } from "./components/apply_download_mail_tpls-form";

const ApplyDownloadMailTplPage = async ({
  params
}: {
  params: { applyDownloadMailTplId: string }
}) => {
  const ret: ApolloQueryResult<{
    ApplyDownloadMailTpl: ApplyDownloadMailTpl
  }> = await apolloServer()
    .query({
      query: GetApplyDownloadMailTplDocument,
      variables: {
        id: params.applyDownloadMailTplId
      },
    });
  const ApplyDownloadMailTpl = ret.data.ApplyDownloadMailTpl;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ApplyDownloadMailTplForm initialData={ApplyDownloadMailTpl} />
      </div>
    </div>
  );
}

export default ApplyDownloadMailTplPage;
