import { gql } from 'graphql-request'

export const POSTS = gql`
  query posts {
    allPosts(count: 50) {
      id
    }
  }
`

export interface PostType {
  id: string
}
