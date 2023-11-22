import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateDetailClient } from './components/client'

export const metadata: Metadata = {
  title: 'アセット詳細',
  openGraph: {
    title: 'アセット詳細',
    ...commonMetadataOpenGraph,
  }
}

const TemplateDetailPage = () => {
  return <TemplateDetailClient />
}

export default TemplateDetailPage