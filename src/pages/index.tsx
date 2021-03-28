import Head from 'next/head'
import React, { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import { GraphQLClient } from 'graphql-request'
import { POSTS, PostType } from '../graphql/posts'
import StackedBarGraph from '../components/StackedBarGraph'

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || ''

const Home = ({ data }: Props): ReactElement => (
  <div className="container">
    <Head>
      <title>User Post Analyser</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <h1>User Post Analyser</h1>
      <StackedBarGraph width={800} height={480} data={data.allPosts} />
    </main>
    <style jsx>{`
      h1 {
        margin: 0;
      }
    `}</style>
  </div>
)

export const getStaticProps: GetStaticProps = async () => {
  const client = new GraphQLClient(GRAPHQL_ENDPOINT)

  const data = await client.request(POSTS)

  return {
    props: { data },
    revalidate: 1,
  }
}

interface Props {
  data: {
    allPosts: PostType[]
  }
}

export default Home
