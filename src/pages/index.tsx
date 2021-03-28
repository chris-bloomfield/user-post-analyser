import Head from 'next/head'
import React, { ReactElement, useState } from 'react'
import { GetStaticProps } from 'next'
import { GraphQLClient } from 'graphql-request'
import { POSTS, PostType } from '../graphql/posts'
import StackedBarGraph from '../components/StackedBarGraph'
import dayjs from 'dayjs'

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || ''

const Home = ({ data }: Props): ReactElement => {
  const sortedDates = data.allPosts.map((post) => post.createdAt).sort()

  const latestDate = sortedDates[sortedDates.length - 1]
  const earliestDate = sortedDates[0]

  const [date, setDate] = useState(dayjs(Number(latestDate)))

  return (
    <div className="container">
      <Head>
        <title>User Post Analyser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>User Post Analyser</h1>
        <div className="description">
          Displays a monthly breakdown of each user&apos;s posts by their likely category.
        </div>
        <div className="date-picker">
          <button
            onClick={() => {
              setDate((prevDate) => dayjs(prevDate).subtract(1, 'month'))
            }}
            disabled={dayjs(Number(earliestDate)).isSame(date, 'month')}
          >
            &lt; Back a month
          </button>
          <span className="current">
            Current month: <span className="date">{dayjs(date).format('MMM YYYY')}</span>
          </span>
          <button
            onClick={() => {
              setDate((prevDate) => dayjs(prevDate).add(1, 'month'))
            }}
            disabled={dayjs(Number(latestDate)).isSame(date, 'month')}
          >
            Forward a month &gt;
          </button>
        </div>
        <StackedBarGraph
          width={800}
          height={480}
          data={data.allPosts.filter((p) => dayjs(Number(p.createdAt)).isSame(date, 'month'))}
        />
      </main>
      <style jsx>{`
        h1 {
          margin: 0 0 8px;
        }

        .description {
          margin-bottom: 24px;
        }

        .date-picker {
          padding: 24px 0;
        }

        .current {
          padding: 0 12px;
        }

        .date {
          font-weight: bold;
        }

        button {
          padding: 16px;
          border: none;
          background-color: #ccc;
        }

        button:disabled {
          background-color: #ddd;
        }
      `}</style>
    </div>
  )
}

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
