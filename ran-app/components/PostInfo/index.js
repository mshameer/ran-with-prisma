// @flow
import * as React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Section, A } from './styles';
import connect from './store';

type Props = {
  loading: boolean,
  post?: Post,
  error?: string,
  postId: string,
  postName: string
};

const PostInfo = ({ loading, post, error }: Props) => {
  if (loading) {
    return (
      <Section>
        <h1>Loading...</h1>
      </Section>
    );
  }

  if (error) {
    console.log(error); // eslint-disable-line no-console
    // window.alert('Load error, check console'); // eslint-disable-line no-alert
    return;
  }

  return (
    <Section>
      <h1>{post && post.title}</h1>
      <div>
        <span>
          ID: <b>{post && post.id}</b>
        </span>
        <span>&nbsp;|&nbsp;</span>
        <span>
          Created At:{' '}
          <b>{moment(post && post.createdAt).format('DD.MM.YYYY kk:mm')}</b>
        </span>
      </div>
      <p>
        <A
          target="_blank"
          href={post && post.url}
          rel="noopener noreferrer nofollow"
        >
          {post && post.url}
        </A>
      </p>
    </Section>
  );
};

PostInfo.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
  error: PropTypes.object,
  postId: PropTypes.string.isRequired,
  postTitle: PropTypes.string.isRequired
};

PostInfo.defaultProps = {
  post: null,
  error: null
};

export default connect(PostInfo);
