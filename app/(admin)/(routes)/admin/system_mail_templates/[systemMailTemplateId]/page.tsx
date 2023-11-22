import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetSystemMailTemplateQuery,
  GetSystemMailTemplateDocument,
  SystemMailTemplate,
} from "@/graphql/generated/graphql";

import { SystemMailTemplateForm } from "./components/system_mail_templates-form";

const SystemMailTemplatePage = async ({
  params
}: {
  params: { systemMailTemplateId: string }
}) => {
  const ret: ApolloQueryResult<GetSystemMailTemplateQuery>
    = await apolloServer()
      .query({
        query: GetSystemMailTemplateDocument,
        variables: {
          id: params.systemMailTemplateId
        },
      });
  const SystemMailTemplate = ret.data.SystemMailTemplate as SystemMailTemplate;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SystemMailTemplateForm initialData={SystemMailTemplate} />
      </div>
    </div>
  );
}

export default SystemMailTemplatePage;
