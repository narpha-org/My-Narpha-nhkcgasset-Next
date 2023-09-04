import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../../styles/Home.module.css'
import { apolloClient, apolloServer } from "../../utils/apolloClient";
import { ApolloQueryResult, FetchResult } from "@apollo/client";
import {
  Sample,
  SamplesAllDocument,
  GetSampleDocument,
  DeleteSampleDocument,
} from "./../../types/generated/graphql";
import { TestItem, TestItemResponse } from "../../types/TestItem";

interface Props {
  testItem: TestItem
}

export const getStaticPaths: GetStaticPaths = async () => {

  let data: Sample[] = []

  await apolloServer
    .query({
      query: SamplesAllDocument,
    })
    .then((res: ApolloQueryResult<{
      samplesAll: Sample[];
    }>) => {

      data = res.data.samplesAll

    }).catch(err => {
      console.error(`[test][getStaticPaths]`)
      console.error(err)
    })

  const paths = data.map((testItem: Sample) => ({
    params: { id: String(testItem.id) },
  }))

  return {
    fallback: true,
    paths,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const ret: ApolloQueryResult<{
    sample: Sample;
  }> = await apolloServer
    .query({
      query: GetSampleDocument,
      variables: {
        id: params!.id,
      },
    })

  console.log(`[test][getStaticProps]`)
  console.log(JSON.stringify(ret.data.sample))

  return {
    props: {
      testItem: ret.data.sample,
    },
  }
}

const TestItemPage: NextPage<Props> = ({ testItem }: Props) => {

  const router = useRouter()

  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Loading&hellip;</h1>
      </div>
    )
  }

  async function handleDelete(): Promise<void> {
    try {

      await apolloClient
        .mutate({
          mutation: DeleteSampleDocument,
          variables: {
            id: testItem.id,
          },
        })
        .then(res => {
          console.log(res.data)
        })

      router.push(`/`)
    } catch (err) {
      console.error(err)
      throw new Error((err as { message: string }).message)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{testItem.text} – Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{testItem.text}</h1>
        <p className={styles.description}>{testItem.created_at}</p>
      </main>

      <footer>
        <button className={styles.footer} onClick={(_event) => router.push(`/`)}>
          Back to TOP
        </button>
        <button className={styles.footer} onClick={handleDelete}>
          💥 Delete testItem
        </button>
      </footer>
    </div>
  )
}

export default TestItemPage