import { Metadata } from 'next'

import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getStockCount } from "@/actions/get-stock-count";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { HomeDashboardClient } from './components/client';

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
  const totalRevenue = await getTotalRevenue();
  const graphRevenue = await getGraphRevenue();
  const salesCount = await getSalesCount();
  const stockCount = await getStockCount();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HomeDashboardClient />
      </div>
    </div>
  );
};

export default HomeDashboardPage;
