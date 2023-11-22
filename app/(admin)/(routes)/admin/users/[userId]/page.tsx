import { getClient as apolloServer } from "@/lib/apollo-server";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  GetUserQuery,
  GetUserDocument,
  User,
  GetCgaRegistrantAffilliationsValidQuery,
  GetCgaRegistrantAffilliationsValidDocument,
  CgaRegistrantAffiliation,
  GetUserRoleCgAssetStoresValidQuery,
  GetUserRoleCgAssetStoresValidDocument,
  UserRoleCgAssetStore,
} from "@/graphql/generated/graphql";

import { UserForm } from "./components/user-form";

const UserPage = async ({
  params
}: {
  params: { userId: string }
}) => {
  const ret: ApolloQueryResult<GetUserQuery>
    = await apolloServer()
      .query({
        query: GetUserDocument,
        variables: {
          id: params.userId
        },
      });
  const User = ret.data.getUser as User;

  const retRegistrantAffiliation: ApolloQueryResult<GetCgaRegistrantAffilliationsValidQuery>
    = await apolloServer()
      .query({
        query: GetCgaRegistrantAffilliationsValidDocument,
      });
  const registrantAffiliations = retRegistrantAffiliation.data.CGARegistrantAffiliationsValid as
    CgaRegistrantAffiliation[];

  const retUserRoleCgAssetStore: ApolloQueryResult<GetUserRoleCgAssetStoresValidQuery>
    = await apolloServer()
      .query({
        query: GetUserRoleCgAssetStoresValidDocument,
      });
  const userRoleCgAssetStores = retUserRoleCgAssetStore.data.UserRoleCGAssetStoresValid as
    UserRoleCgAssetStore[];

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
