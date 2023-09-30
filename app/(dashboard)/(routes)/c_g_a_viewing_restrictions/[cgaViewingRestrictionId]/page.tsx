import { getClient as apolloServer } from "@/lib/apolloServer";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgaViewingRestriction,
  GetCgaViewingRestrictionDocument,
} from "@/graphql/generated/graphql";

import { CGAViewingRestrictionForm } from "./components/c_g_a_viewing_restriction-form";

const CGAViewingRestrictionPage = async ({
  params
}: {
  params: { cgaViewingRestrictionId: string }
}) => {
  const ret: ApolloQueryResult<{
    CGAViewingRestriction: CgaViewingRestriction
  }> = await apolloServer()
    .query({
      query: GetCgaViewingRestrictionDocument,
      variables: {
        id: params.cgaViewingRestrictionId
      },
    });
  const CGAViewingRestriction = ret.data.CGAViewingRestriction;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGAViewingRestrictionForm initialData={CGAViewingRestriction} />
      </div>
    </div>
  );
}

export default CGAViewingRestrictionPage;
