import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  User,
  GetUserDocument,
  CgaRegistrantAffiliation,
  GetCgaRegistrantAffilliationsValidDocument,
  UserRoleCgAssetStore,
  GetUserRoleCgAssetStoresValidDocument,
} from "@/graphql/generated/graphql";

import { UserForm } from "./components/user-form";

const UserPage = async ({
  params
}: {
  params: { userId: string }
}) => {
  const ret: ApolloQueryResult<{
    getUser: User
  }> = await apolloServer()
    .query({
      query: GetUserDocument,
      variables: {
        id: params.userId
      },
    });
  const User = ret.data.getUser;

  const retRegistrantAffiliation: ApolloQueryResult<{
    CGARegistrantAffiliationsValid: CgaRegistrantAffiliation[]
  }> = await apolloServer()
    .query({
      query: GetCgaRegistrantAffilliationsValidDocument,
    });
  const registrantAffiliations = retRegistrantAffiliation.data.CGARegistrantAffiliationsValid;

  const retUserRoleCgAssetStore: ApolloQueryResult<{
    UserRoleCGAssetStoresValid: UserRoleCgAssetStore[]
  }> = await apolloServer()
    .query({
      query: GetUserRoleCgAssetStoresValidDocument,
    });
  const userRoleCgAssetStores = retUserRoleCgAssetStore.data.UserRoleCGAssetStoresValid;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserForm
          initialData={User}
          registrantAffiliations={registrantAffiliations}
          userRoleCgAssetStores={userRoleCgAssetStores}
        />
      </div>
    </div>
  );
}

export default UserPage;
