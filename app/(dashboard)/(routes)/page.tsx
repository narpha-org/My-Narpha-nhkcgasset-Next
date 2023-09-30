import { Metadata } from 'next'
import { CreditCard, DollarSign, Package } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getStockCount } from "@/actions/get-stock-count";
import { formatter } from "@/lib/utils";
import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { DashboardClient } from './components/client';

export const metadata: Metadata = {
  title: 'ダッシュボード',
  openGraph: {
    title: 'ダッシュボード',
    ...commonMetadataOpenGraph,
  }
}

interface DashboardPageProps {
  params: {
  };
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
  params
}) => {
  const totalRevenue = await getTotalRevenue();
  const graphRevenue = await getGraphRevenue();
  const salesCount = await getSalesCount();
  const stockCount = await getStockCount();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DashboardClient />
      </div>
    </div>
  );
};

export default DashboardPage;
