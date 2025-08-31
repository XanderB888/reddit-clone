import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostCard.css';

function PostCard({ post }) {
  const navigate = useNavigate();

  // Helper function to get video preview/poster image
  const getVideoPoster = () => {
    // Try to get a good preview image for video
    if (post.preview && post.preview.images && post.preview.images[0]) {
      return post.preview.images[0].source.url.replace(/&amp;/g, '&');
    }
    
    // Fall back to thumbnail
    if (post.thumbnail && 
        post.thumbnail !== 'self' && 
        post.thumbnail !== 'default' && 
        post.thumbnail !== 'nsfw' &&
        post.thumbnail.startsWith('http')) {
      return post.thumbnail;
    }
    
    return null;
  };

  // Helper function to check if it's a video post
  const getVideoUrl = () => {
    // Reddit video posts
    if (post.media && post.media.reddit_video) {
      return post.media.reddit_video.fallback_url;
    }
    
    // v.redd.it videos
    if (post.url && post.url.includes('v.redd.it')) {
      return post.url;
    }
    
    // GIF posts (treated as videos)
    if (post.url && post.url.includes('.gif')) {
      return post.url;
    }
    
    return null;
  };

  // Helper function to get the best image URL
  const getImageUrl = () => {
    // Don't show image if it's a video
    if (getVideoUrl()) return null;
    
    // Check if there's a preview image
    if (post.preview && post.preview.images && post.preview.images[0]) {
      return post.preview.images[0].source.url.replace(/&amp;/g, '&');
    }
    
    // Fall back to thumbnail if it's a valid image URL
    if (post.thumbnail && 
        post.thumbnail !== 'self' && 
        post.thumbnail !== 'default' && 
        post.thumbnail !== 'nsfw' &&
        post.thumbnail.startsWith('http')) {
      return post.thumbnail;
    }
    
    // If it's an image URL, use it directly
    if (post.url && (post.url.includes('i.redd.it') || 
                     post.url.includes('imgur.com') ||
                     post.url.match(/\.(jpg|jpeg|png)$/i))) {
      return post.url;
    }
    
    return null;
  };

  // Format time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp * 1000);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const imageUrl = getImageUrl();
  const videoUrl = getVideoUrl();
  const posterUrl = getVideoPoster();

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showPoster, setShowPoster] = useState(true);

  return (
    <div className="post-card">
      {/* Top section: User info and time */}
      <div className="post-header">
        <div className="user-avatar">
          <div className="avatar-circle">r/</div>
        </div>
        <div className="post-user-info">
          <span className="subreddit-name">r/{post.subreddit}</span>
          <span className="post-meta-text">• Posted by u/{post.author} • {getTimeAgo(post.created_utc)}</span>
        </div>
      </div>

      {/* Post title */}
      <h3 
        className="post-title"
        onClick={() => navigate(`/post/${post.id}`, { state: { post } })}
      >
        {post.title}
      </h3>

      {/* Post content (text if any) */}
      {post.selftext && (
        <div className="post-text-preview">
          <p>{post.selftext.length > 150 ? post.selftext.substring(0, 150) + '...' : post.selftext}</p>
        </div>
      )}

      {/* Video content */}
      {videoUrl && (
        <div className="post-video-container">
          <video 
            className="post-video" 
            controls
            preload="metadata"
            poster={imageUrl || post.thumbnail}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay">
            <span className="video-indicator">📹 Video</span>
          </div>
        </div>
      )}

      {/* Post image (only if no video) */}
      {!videoUrl && imageUrl && (
        <div 
          className="post-image-container"
          onClick={() => navigate(`/post/${post.id}`, { state: { post } })}
        >
          <img 
            src={imageUrl} 
            alt={post.title}
            className="post-main-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* External link preview (if no image or video) */}
      {!videoUrl && !imageUrl && post.url && !post.url.includes('reddit.com') && (
        <div className="external-link-preview">
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="external-link">
            🔗 {post.url.replace(/^https?:\/\//, '').split('/')[0]}
          </a>
        </div>
      )}

      {/* Bottom section: Actions */}
      <div className="post-actions">
        <div className="action-group">
          <button className="action-button vote-button">
            <span className="vote-arrow">⬆</span>
            <span className="vote-count">{post.score}</span>
            <span className="vote-arrow">⬇</span>
          </button>
        </div>
        
        <div className="action-group">
          <button 
            className="action-button comment-button"
            onClick={() => navigate(`/post/${post.id}`, { state: { post } })}
          >
            <span className="action-icon">💬</span>
            <span>{post.comments}</span>
          </button>
        </div>

        <div className="action-group">
          <button className="action-button">
            <span className="action-icon">↗️</span>
            <span>Share</span>
          </button>
        </div>

        <div className="action-group">
          <button className="action-button">
            <span className="action-icon">⭐</span>
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;