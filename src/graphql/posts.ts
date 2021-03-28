import { gql } from 'graphql-request'

export const POSTS = gql`
  query posts {
    allPosts(count: 500) {
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
