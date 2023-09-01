import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../../styles/Home.module.css'
import { apiClient, apiServer } from "../../utils/apiClient";
import { TestItem, TestItemResponse } from "../../types/TestItem";

interface Props {
  testItem: TestItem
}

export const getStaticPaths: GetStaticPaths = async () => {

  let data: TestItem[] = []

  await apiServer.get<TestItemResponse[]>('testAll')
    .then((res) => {

      data = res.data

    }).catch(err => {
      console.error(`[test][getStaticPaths]`)
      console.error(err)
    })

  const paths = data.map((testItem: TestItem) => ({
    params: { id: String(testItem.id) },
  }))

  return {
    fallback: true,
    paths,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const ret = await apiServer.get<TestItem>(`test/${params!.id}`)

  console.log(`[test][getStaticProps]`)
  console.log(ret.data)

  return {
    props: {
      testItem: ret.data,
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

      await apiClient.delete<boolean>(`test/${testItem.id}/delete`)
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