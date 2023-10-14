import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgaRegistrantAffiliation,
  GetCgaRegistrantAffiliationDocument,
} from "@/graphql/generated/graphql";

import { CGARegistrantAffiliationForm } from "./components/c_g_a_registrant_affiliation-form";

const CGARegistrantAffiliationPage = async ({
  params
}: {
  params: { cgaRegistrantAffiliationId: string }
}) => {
  const ret: ApolloQueryResult<{
    CGARegistrantAffiliation: CgaRegistrantAffiliation
  }> = await apolloServer()
    .query({
      query: GetCgaRegistrantAffiliationDocument,
      variables: {
        id: params.cgaRegistrantAffiliationId
      },
    });
  const CGARegistrantAffiliation = ret.data.CGARegistrantAffiliation;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGARegistrantAffiliationForm initialData={CGARegistrantAffiliation} />
      </div>
    </div>
  );
}

export default CGARegistrantAffiliationPage;
