import React from 'react';
import './PostCard.css';
import { useNavigate } from 'react-router-dom';

function PostCard({ post }) {
  const navigate = useNavigate();

  //Helper function to get the best image url
  const getImageUrl = () => {
    //Check if there's a preview image
    if (post.preview && post.preview.images && post.preview.images[0]) {
      return post.preview.images[0].source.url.replace(/&amp;/g, '&');
    }

    //Fall back to thumbnail if it's a valid image URL
    if (post.tumbnail &&
        post.thumbnail !== 'self' &&
        post.thumbnail !== 'default' &&
        post.thumbnail !== 'nsfw' &&
        post.thumbnail.startsWith('http')) {
          return post.thumbnail;
        }

     //If it's an image URL, use it directly
    if (post.url && (post.url.includes('i.redd.it') ||
                     post.url.includes('imgur.com') ||
                     post.url.match(/\.(jpg|jpeg|png|gif)$/i))) {
      return post.url;
    } 
  
  return null;
};

const imageUrl = getImageUrl();

  return (
    <div
      className="post-card"
      onClick={() => navigate(`/post/${post.id}`, { state: { post } })}
      style={{ cursor: 'pointer' }}
    >
      <div className="post-content">
        <div className="post-text">
          <h3 className="post-title">{post.title}</h3>
          <div className="post-meta">
            <span className="subreddit">r/{post.subreddit}</span>
            <span>• Posted by u/{post.author}</span>
          </div>
          <div className="post-stats">
            <span>💬 {post.comments} Comments</span>
            <span>• ⬆️ {post.score} points</span>
          </div>
        </div>
        
        {imageUrl && (
          <div className="post-image">
            <img 
              src={imageUrl} 
              alt={post.title}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;