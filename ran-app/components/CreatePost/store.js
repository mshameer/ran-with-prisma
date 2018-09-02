import { graphql } from 'react-apollo';
import createPostGql from './createPost.gql';

export const withMutation = graphql(createPostGql, {
  props: ({ mutate }) => ({
    mutations: {
      createPost: (title, url) =>
        mutate({
          variables: { title, url },
          updateQueries: {
            posts: (previousResult, { mutationResult }) => {
              const newPost = mutationResult.data.createPost;
              return Object.assign({}, previousResult, {
                // Append the new post
                posts: [newPost, ...previousResult.posts]
              });
            }
          }
        })
    }
  })
});

export default comp => withMutation(comp);
