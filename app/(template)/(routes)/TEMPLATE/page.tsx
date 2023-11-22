import { Metadata } from 'next'

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

import { TemplateTop1Client } from './components/client'

export const metadata: Metadata = {
  title: 'TOP',
  openGraph: {
    title: 'TOP',
    ...commonMetadataOpenGraph,
  }
}

const TemplateTop1Page = () => {
  return <TemplateTop1Client />
}

export default TemplateTop1Page