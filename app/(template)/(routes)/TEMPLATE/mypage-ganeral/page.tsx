import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateClient } from './components/client'

export const metadata: Metadata = {
  title: 'mypage-ganeral',
  openGraph: {
    title: 'mypage-ganeral',
    ...commonMetadataOpenGraph,
  }
}

const TemplateMyPageGeneralPage = () => {
  return <TemplateClient />
}

export default TemplateMyPageGeneralPage