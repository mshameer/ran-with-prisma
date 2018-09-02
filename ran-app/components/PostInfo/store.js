import { graphql } from 'react-apollo';
import getPostGql from './getPost.gql';

const withData = graphql(getPostGql, {
  options: ({ postId }) => ({
    variables: {
      postId
    }
  }),
  props: ({ data: { loading, posts, error } }) => ({
    loading,
    post: posts[0],
    error
  })
});

export default comp => withData(comp);
