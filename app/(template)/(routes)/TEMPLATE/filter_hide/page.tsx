import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateClient } from './components/client'

export const metadata: Metadata = {
  title: 'TOP（フィルター閉）',
  openGraph: {
    title: 'TOP（フィルター閉）',
    ...commonMetadataOpenGraph,
  }
}

const TemplateTop2Page = () => {
  return <TemplateClient />
}

export default TemplateTop2Page