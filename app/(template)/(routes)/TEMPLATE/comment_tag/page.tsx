import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateClient } from './components/client'

export const metadata: Metadata = {
  title: 'comment_tag',
  openGraph: {
    title: 'comment_tag',
    ...commonMetadataOpenGraph,
  }
}

const TemplateCommentTagPage = () => {
  return <TemplateClient />
}

export default TemplateCommentTagPage