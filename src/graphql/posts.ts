import { gql } from 'graphql-request'

export const POSTS = gql`
  query posts {
    allPosts(count: 500) {
      createdAt
      author {
        id
        firstName
        lastName
      }
      likelyTopics {
        label
        likelihood
      }
    }
  }
`

export interface PostType {
  createdAt: string
  author: {
    id: string
    firstName: string
    lastName: string
  }
  likelyTopics: {
    label: string
    likelihood: number
  }[]
}
