import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateClient } from './components/client'

export const metadata: Metadata = {
  title: 'mypage',
  openGraph: {
    title: 'mypage',
    ...commonMetadataOpenGraph,
  }
}

const TemplateMyPagePage = () => {
  return <TemplateClient />
}

export default TemplateMyPagePage