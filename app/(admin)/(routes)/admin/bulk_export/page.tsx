import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
import { BulkExportForm } from "./components/bulk_export-form";

export const metadata: Metadata = {
  title: 'データエクスポート',
  openGraph: {
    title: 'データエクスポート',
    ...commonMetadataOpenGraph,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_DOMAIN ?
      `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}` :
      `http://localhost:3000`
  )
}

const BulkExportPage = async ({
  params
}: {
  params: {}
}) => {

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BulkExportForm />
      </div>
    </div>
  );
};

export default BulkExportPage;
