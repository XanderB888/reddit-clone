import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  if (!post) {
    return (
      <div className="post-detail-container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <div className="post-not-found">
          <h2>Post not found</h2>
          <p>Sorry, we couldn't find that post.</p>
        </div>
      </div>
    );
  }

  // Helper function to get the best image URL
  const getImageUrl = () => {
    if (post.preview && post.preview.images && post.preview.images[0]) {
      return post.preview.images[0].source.url.replace(/&amp;/g, '&');
    }
    
    if (post.thumbnail && 
        post.thumbnail !== 'self' && 
        post.thumbnail !== 'default' && 
        post.thumbnail !== 'nsfw' &&
        post.thumbnail.startsWith('http')) {
      return post.thumbnail;
    }
    
    if (post.url && (post.url.includes('i.redd.it') || 
                     post.url.includes('imgur.com') ||
                     post.url.match(/\.(jpg|jpeg|png|gif)$/i))) {
      return post.url;
    }
    
    return null;
  };

  // Format the date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const imageUrl = getImageUrl();
  const isVideoPost = post.url && (post.url.includes('youtube.com') || post.url.includes('youtu.be'));
  const isExternalLink = post.url && !imageUrl && !isVideoPost;

  return (
    <div className="post-detail-container">
      {/* Header with back button */}
      <div className="post-detail-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <div className="subreddit-info">
          <span className="subreddit-name">r/{post.subreddit}</span>
        </div>
      </div>

      {/* Main post content */}
      <div className="post-detail-content">
        <div className="post-voting">
          <button className="vote-button upvote">▲</button>
          <span className="vote-count">{post.score}</span>
          <button className="vote-button downvote">▼</button>
        </div>

        <div className="post-main">
          <h1 className="post-title">{post.title}</h1>
          
          <div className="post-meta">
            <span>Posted by <strong>u/{post.author}</strong></span>
            <span>•</span>
            <span>{formatDate(post.created_utc)}</span>
          </div>

          {/* Post content area */}
          <div className="post-body">
            {/* Text content */}
            {post.selftext && (
              <div className="post-text">
                <p>{post.selftext}</p>
              </div>
            )}

            {/* Image content */}
            {imageUrl && (
              <div className="post-media">
                <img src={imageUrl} alt={post.title} className="post-image" />
              </div>
            )}

            {/* Video content */}
            {isVideoPost && (
              <div className="post-media">
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="video-link">
                  🎥 Watch Video: {post.url}
                </a>
              </div>
            )}

            {/* External link */}
            {isExternalLink && (
              <div className="post-media">
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="external-link">
                  🔗 {post.url}
                </a>
              </div>
            )}
          </div>

          {/* Post actions */}
          <div className="post-actions">
            <div className="action-item">
              <span>💬 {post.comments} Comments</span>
            </div>
            <div className="action-item">
              <span>🔗 Share</span>
            </div>
            <div className="action-item">
              <span>💾 Save</span>
            </div>
          </div>

          {/* Comments section placeholder */}
          <div className="comments-section">
            <h3>Comments</h3>
            <div className="comments-placeholder">
              <p>Comments would be loaded here in a full implementation.</p>
              <p>This would require additional Reddit API calls to fetch comment threads.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;