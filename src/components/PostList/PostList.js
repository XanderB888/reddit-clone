import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, loadMorePosts } from '../../features/posts/postsSlice';
import PostCard from '../PostCard/PostCard';
import './PostList.css';

function PostList({ posts, status }) {
  const dispatch = useDispatch();
  const { loadMoreStatus, hasMore, after } = useSelector((state) => state.posts);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts({}));
    }
  }, [status, dispatch]);

  const handleLoadMore = () => {
    const currentSubreddit = ''; // You can pass this from parent if needed
    dispatch(loadMorePosts({ subreddit: currentSubreddit, after }));
  };

  if (status === 'loading') {
    return <p>Loading posts...</p>;
  }

  if (status === 'failed') {
    return <p>Failed to load posts.</p>;
  }

  return (
    <div className="post-list">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>No posts match your criteria.</p>
      )}
      
      {/* Load More Button */}
      {hasMore && posts.length > 0 && (
        <div className="load-more-container">
          <button
            className={`load-more-button ${loadMoreStatus === 'loading' ? 'loading' : ''}`}
            onClick={handleLoadMore}
            disabled={loadMoreStatus === 'loading'}
          >
            {loadMoreStatus === 'loading' ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}

      {/* End of posts message */}
      {!hasMore && posts.length > 0 && (
        <div className="load-more-container">
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            You've reached the end! No more posts to load.
          </p>
        </div>
      )}
    </div>
  );
}

export default PostList;