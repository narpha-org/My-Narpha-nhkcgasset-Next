import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateClient } from './components/client'

export const metadata: Metadata = {
  title: 'TOP（フィルター開）',
  openGraph: {
    title: 'TOP（フィルター開）',
    ...commonMetadataOpenGraph,
  }
}

const TemplateTop1Page = () => {
  return <TemplateClient />
}

export default TemplateTop1Page