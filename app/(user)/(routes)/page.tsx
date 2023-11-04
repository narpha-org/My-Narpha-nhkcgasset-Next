import { Metadata } from 'next'
// import { getServerSession } from "next-auth/next";
// import { Session } from "next-auth";
// import { authOptions } from "@/lib/auth-options";

// import { getClient as apolloServer } from "@/lib/apollo-server";
// import { ApolloQueryResult } from "@apollo/client";
// import {
// } from "@/graphql/generated/graphql";

// import { getTotalRevenue } from "@/actions/get-total-revenue";
// import { getSalesCount } from "@/actions/get-sales-count";
// import { getGraphRevenue } from "@/actions/get-graph-revenue";
// import { getStockCount } from "@/actions/get-stock-count";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { isServerRoleAdmin, isServerRoleManager, isServerRoleUser } from '@/lib/check-role-server';

import HomeDashboardServerAdmin from './components/server-admin';
import HomeDashboardServerManager from './components/server-manager';
import HomeDashboardServerUser from './components/server-user';

export const metadata: Metadata = {
  title: 'NHK CGアセットストア',
  openGraph: {
    title: 'NHK CGアセットストア',
    ...commonMetadataOpenGraph,
  }
}

interface HomeDashboardPageProps {
  params: {
  };
};

const HomeDashboardPage: React.FC<HomeDashboardPageProps> = async ({
  params
}) => {
  // const session: Session | null = await getServerSession(authOptions)

  // const totalRevenue = await getTotalRevenue();
  // const graphRevenue = await getGraphRevenue();
  // const salesCount = await getSalesCount();
  // const stockCount = await getStockCount();

  if (await isServerRoleAdmin()) {
    return <HomeDashboardServerAdmin />;
  }

  if (await isServerRoleManager()) {
    return <HomeDashboardServerManager />;
  }

  return <HomeDashboardServerUser />;
};

export default HomeDashboardPage;
