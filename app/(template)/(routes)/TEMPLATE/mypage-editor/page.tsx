import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateClient } from './components/client'

export const metadata: Metadata = {
  title: 'mypage-editor',
  openGraph: {
    title: 'mypage-editor',
    ...commonMetadataOpenGraph,
  }
}

const TemplateMyPageEditorPage = () => {
  return <TemplateClient />
}

export default TemplateMyPageEditorPage