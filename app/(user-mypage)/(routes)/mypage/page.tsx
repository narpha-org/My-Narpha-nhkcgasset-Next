import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import {
  isServerRoleAdmin,
  isServerRoleEditor,
  isServerRoleManager,
  isServerRoleOther,
  isServerRoleUser
} from '@/lib/check-role-server';
import { Loader } from "@/components/ui/loader";

import HomeDashboardServerAdmin from './components/server-admin';
import HomeDashboardServerManager from './components/server-manager';
import HomeDashboardServerEditor from './components/server-editor';
import HomeDashboardServerUser from './components/server-user';
import HomeDashboardServerOther from './components/server-other';

export const metadata: Metadata = {
  title: 'NHK CGアセットストア',
  openGraph: {
    title: 'NHK CGアセットストア',
    ...commonMetadataOpenGraph,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_DOMAIN ?
      `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}` :
      `http://localhost:3000`
  )
}

interface HomeDashboardPageProps {
  params: {
  };
};

const HomeDashboardPage: React.FC<HomeDashboardPageProps> = async ({
  params
}) => {

  if (await isServerRoleAdmin()) {
    return <HomeDashboardServerAdmin />;
  }

  if (await isServerRoleManager()) {
    return <HomeDashboardServerManager />;
  }

  if (await isServerRoleEditor()) {
    return <HomeDashboardServerEditor />;
  }

  if (await isServerRoleUser()) {
    return <HomeDashboardServerUser />;
  }

  if (await isServerRoleOther()) {
    return <HomeDashboardServerOther />;
  }

  return <Loader />;
};

export default HomeDashboardPage;
