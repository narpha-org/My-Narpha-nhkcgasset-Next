import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetCgaViewingRestrictionQuery,
  GetCgaViewingRestrictionDocument,
  CgaViewingRestriction,
} from "@/graphql/generated/graphql";

import { CGAViewingRestrictionForm } from "./components/c_g_a_viewing_restriction-form";

const CGAViewingRestrictionPage = async ({
  params
}: {
  params: { cgaViewingRestrictionId: string }
}) => {
  const ret: ApolloQueryResult<GetCgaViewingRestrictionQuery>
    = await apolloServer()
      .query({
        query: GetCgaViewingRestrictionDocument,
        variables: {
          id: params.cgaViewingRestrictionId
        },
      });
  const CGAViewingRestriction = ret.data.CGAViewingRestriction as CgaViewingRestriction;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAViewingRestrictionForm initialData={CGAViewingRestriction} />
      </div>
    </div>
  );
}

export default CGAViewingRestrictionPage;
