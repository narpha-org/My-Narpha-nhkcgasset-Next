import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { BulkRegistrationForm } from './components/bulk_registration-form';

export const metadata: Metadata = {
  title: 'データ一括登録',
  openGraph: {
    title: 'データ一括登録',
    ...commonMetadataOpenGraph,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_DOMAIN ?
      `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}` :
      `http://localhost:3000`
  )
}

const BulkRegistrationPage = async ({
  params
}: {
  params: {}
}) => {

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BulkRegistrationForm />
      </div>
    </div>
  );
};

export default BulkRegistrationPage;
