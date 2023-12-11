import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { AdminDashboardClient } from './components/client';

export const metadata: Metadata = {
  title: '管理TOP | NHK CGアセットストア',
  openGraph: {
    title: '管理TOP | NHK CGアセットストア',
    ...commonMetadataOpenGraph,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_DOMAIN ?
      `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}` :
      `http://localhost:3000`
  )
}

interface DashboardPageProps {
  params: {
  };
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
  params
}) => {

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AdminDashboardClient />
      </div>
    </div>
  );
};

export default DashboardPage;
