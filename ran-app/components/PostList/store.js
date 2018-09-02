import { graphql } from 'react-apollo';
import allPostsGql from './allPosts.gql';

const POSTS_PER_PAGE = 10;

const withData = graphql(allPostsGql, {
  options: () => ({
    variables: {
      skip: 0,
      first: POSTS_PER_PAGE
    }
  }),
  props: ({ data }) => ({
    data,
    loadMorePosts: () =>
      data.fetchMore({
        variables: {
          skip: data.posts.length
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            // Append the new posts results to the old one
            posts: [...previousResult.posts, ...fetchMoreResult.posts]
          });
        }
      })
  })
});

export default comp => withData(comp);
