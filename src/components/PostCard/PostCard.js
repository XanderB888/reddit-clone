import React from 'react';
import './PostCard.css';

function Postcard({ post }) {
    return (
        <div className='post-card'>
            <h3>{post.title}</h3>
            <div className='post-meta'>
                <span>{post.subreddit}</span>
                <span>• Posted by u/{post.author}</span>
                <span>• 💬 {post.comments} comments</span>
                <span>• ⬆️ {post.score}</span>
            </div>
        </div>
    );
}

export default Postcard;