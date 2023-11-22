import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetCgaBroadcastingRightQuery,
  GetCgaBroadcastingRightDocument,
  CgaBroadcastingRight,
} from "@/graphql/generated/graphql";

import { CGaBroadcastingRightForm } from "./components/c_g_a_broadcasting_right-form";

const CGaBroadcastingRightPage = async ({
  params
}: {
  params: { cgaBroadcastingRightId: string }
}) => {
  const ret: ApolloQueryResult<GetCgaBroadcastingRightQuery>
    = await apolloServer()
      .query({
        query: GetCgaBroadcastingRightDocument,
        variables: {
          id: params.cgaBroadcastingRightId
        },
      });
  const CGaBroadcastingRight = ret.data.CGABroadcastingRight as CgaBroadcastingRight;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGaBroadcastingRightForm initialData={CGaBroadcastingRight} />
      </div>
    </div>
  );
}

export default CGaBroadcastingRightPage;
