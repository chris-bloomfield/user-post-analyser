import React, { ReactElement } from 'react'
import { PostType } from '../graphql/posts'
import { groupBy, path } from 'ramda'
import dayjs from 'dayjs'
import { schemeSpectral } from 'd3-scale-chromatic'
import { BarStackHorizontal } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { LegendOrdinal } from '@visx/legend'

const LIKELY_TOPICS = [
  'community',
  'birthday',
  'fishing',
  'celebrity',
  'security',
  'potato',
  'sport',
  'management',
  'wedding',
  'shopping',
]

const StackedBarGraph = ({ width, height, data }: Props): ReactElement => {
  const margin = { top: 40, left: 120, right: 40, bottom: 60 }

  // Create an object with a key for each user containing an array of posts
  const postsGroupedByUser = groupBy(path(['author', 'id']))(data)

  // Reduce each user's posts to a single set of accumulated topic values
  const barStackData = Object.keys(postsGroupedByUser).map((key) =>
    postsGroupedByUser[key].reduce(
      (p, currentPost) => ({
        name: p.name || `${currentPost.author.firstName} ${currentPost.author.lastName}`,
        ...LIKELY_TOPICS.reduce(
          (t, currentTopic) => ({
            ...t,
            [currentTopic]:
              currentPost.likelyTopics.find((p) => p.label === currentTopic).likelihood +
              (p[currentTopic] || 0),
          }),
          {}
        ),
      }),
      []
    )
  )

  const keys = LIKELY_TOPICS.sort()

  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  // Accessor for user names
  const getUserName = (d) => d.name

  const postTotals = barStackData.reduce((allTotals, currentUser) => {
    const totalPosts = keys.reduce((dailyTotal, cur) => {
      dailyTotal += currentUser[cur]
      return dailyTotal
    }, 0)
    allTotals.push(Math.round(totalPosts))
    return allTotals
  }, [] as number[])

  // Scales
  const postsScale = scaleLinear<number>({
    domain: [0, Math.max(...postTotals)],
    nice: true,
  }).rangeRound([0, xMax])

  const userScale = scaleBand<string>({
    domain: barStackData.map(getUserName),
    padding: 0.2,
  }).rangeRound([yMax, 0])

  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: schemeSpectral[10],
  })

  return (
    <div>
      <div>
        <span className="legend">Likely post category:</span>
        <LegendOrdinal scale={colorScale} direction="row" labelMargin="5px 20px 5px 5px" />
      </div>
      <svg width={width} height={height}>
        <Group top={margin.top} left={margin.left}>
          <BarStackHorizontal
            data={barStackData}
            keys={keys}
            height={yMax}
            y={getUserName}
            xScale={postsScale}
            yScale={userScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                  />
                ))
              )
            }
          </BarStackHorizontal>
          <AxisLeft
            hideTicks
            scale={userScale}
            stroke={'grey'}
            numTicks={barStackData.length}
            tickStroke={'grey'}
            tickLabelProps={() => ({
              fill: 'grey',
              fontSize: 12,
              textAnchor: 'end',
              dy: '0.33em',
            })}
          />
          <AxisBottom
            top={yMax}
            scale={postsScale}
            label={'Number of posts'}
            labelProps={{
              fill: 'grey',
              fontSize: 14,
            }}
            stroke={'grey'}
            tickStroke={'grey'}
            tickLabelProps={() => ({
              fill: 'grey',
              fontSize: 12,
              textAnchor: 'middle',
            })}
          />
        </Group>
      </svg>
      <style jsx>{`
        .legend {
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

interface Props {
  width: number
  height: number
  data: PostType[]
}

export default StackedBarGraph
