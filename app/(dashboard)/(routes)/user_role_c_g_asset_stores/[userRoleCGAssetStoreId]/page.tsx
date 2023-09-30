import { getClient as apolloServer } from "@/lib/apolloServer";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  UserRoleCgAssetStore,
  GetUserRoleCgAssetStoreDocument,
} from "@/graphql/generated/graphql";

import { UserRoleCgAssetStoreForm } from "./components/user_role_c_g_asset_store-form";

const UserRoleCgAssetStorePage = async ({
  params
}: {
  params: { userRoleCgAssetStoreId: string }
}) => {
  const ret: ApolloQueryResult<{
    UserRoleCGAssetStore: UserRoleCgAssetStore
  }> = await apolloServer()
    .query({
      query: GetUserRoleCgAssetStoreDocument,
      variables: {
        id: params.userRoleCgAssetStoreId
      },
    });
  const UserRoleCGAssetStore = ret.data.UserRoleCGAssetStore;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserRoleCgAssetStoreForm initialData={UserRoleCGAssetStore} />
      </div>
    </div>
  );
}

export default UserRoleCgAssetStorePage;
