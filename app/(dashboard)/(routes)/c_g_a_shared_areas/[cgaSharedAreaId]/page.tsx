import { getClient as apolloServer } from "@/lib/apolloServer";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  CgaSharedArea,
  GetCgaSharedAreaDocument,
} from "@/graphql/generated/graphql";

import { CGASharedAreaForm } from "./components/c_g_a_shared_area-form";

const CGASharedAreaPage = async ({
  params
}: {
  params: { cgaSharedAreaId: string }
}) => {
  const ret: ApolloQueryResult<{
    CGASharedArea: CgaSharedArea
  }> = await apolloServer()
    .query({
      query: GetCgaSharedAreaDocument,
      variables: {
        id: params.cgaSharedAreaId
      },
    });
  const CGASharedArea = ret.data.CGASharedArea;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CGASharedAreaForm initialData={CGASharedArea} />
      </div>
    </div>
  );
}

export default CGASharedAreaPage;
