import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateRegistrationClient } from './components/client'

export const metadata: Metadata = {
  title: 'アセット追加',
  openGraph: {
    title: 'アセット追加',
    ...commonMetadataOpenGraph,
  }
}

const TemplateRegistrationPage = () => {
  return <TemplateRegistrationClient />
}

export default TemplateRegistrationPage