import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateClient } from './components/client'

export const metadata: Metadata = {
  title: 'detail-dialog',
  openGraph: {
    title: 'detail-dialog',
    ...commonMetadataOpenGraph,
  }
}

const TemplateDetailDialogPage = () => {
  return <TemplateClient />
}

export default TemplateDetailDialogPage