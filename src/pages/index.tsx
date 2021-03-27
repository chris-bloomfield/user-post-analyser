import Head from 'next/head'
import React, { ReactElement } from 'react'

const Home = (): ReactElement => (
  <div className="container">
    <Head>
      <title>User Post Analyser</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <h1>User Post Analyser</h1>
    </main>
    <style jsx>{`
      h1 {
        margin: 0;
      }
    `}</style>
  </div>
)

export default Home
