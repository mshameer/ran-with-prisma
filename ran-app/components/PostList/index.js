// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../routes';
import PostUpvoter from '../PostUpvoter';
import {
  Main,
  ItemList,
  Item,
  Index,
  Title,
  ShowMore,
  Loading
} from './styles';
import connect from './store';

type Props = {
  data: {
    posts: Array<Post>,
    _allPostsMeta: { count: number },
    loading: boolean
  },
  loadMorePosts: () => void
};

const PostList = ({ data, loadMorePosts }: Props) => {
  if (data.posts && data.posts.length) {
    const areMorePosts = data.posts.length < 15;
    return (
      <Main>
        <ItemList>
          {data.posts.map((post, index) => (
            <Item key={post.id}>
              <div>
                <Index>{index + 1}. </Index>
                <Link
                  route="details"
                  params={{
                    postId: post.id,
                    postTitle: encodeURIComponent(post.title)
                  }}
                  passHref
                >
                  <Title>{post.title}</Title>
                </Link>
                <PostUpvoter id={post.id} votes={post.votes} />
              </div>
            </Item>
          ))}
        </ItemList>
        {areMorePosts ? (
          <ShowMore onClick={() => loadMorePosts()}>
            {data.loading ? 'Loading...' : 'Show More'}
          </ShowMore>
        ) : (
          ''
        )}
      </Main>
    );
  }
  return <Loading>Loading</Loading>;
};

PostList.propTypes = {
  data: PropTypes.object.isRequired,
  loadMorePosts: PropTypes.func.isRequired
};

export default connect(PostList);
