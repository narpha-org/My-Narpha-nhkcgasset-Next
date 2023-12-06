import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateClient } from './components/client'

export const metadata: Metadata = {
  title: 'アセット登録',
  openGraph: {
    title: 'アセット登録',
    ...commonMetadataOpenGraph,
  }
}

const TemplateRegistrationPage = () => {
  return <TemplateClient />
}

export default TemplateRegistrationPage