import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateTop2Client } from './components/client'

export const metadata: Metadata = {
  title: 'TOP',
  openGraph: {
    title: 'TOP',
    ...commonMetadataOpenGraph,
  }
}

const TemplateTop2Page = () => {
  return <TemplateTop2Client />
}

export default TemplateTop2Page