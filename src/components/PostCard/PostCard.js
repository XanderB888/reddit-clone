import React from 'react';
import './PostCard.css';
import { useNavigate } from 'react-router-dom';

function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <div
      className="post-card"
      onClick={() => navigate(`/post/${post.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <h3>{post.title}</h3>
      <p>r/{post.subreddit} • Posted by u/{post.author}</p>
      <p>💬 {post.comments} Comments • ⬆️ {post.score} points</p>
    </div>
  );
}