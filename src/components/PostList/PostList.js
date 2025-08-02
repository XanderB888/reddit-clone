import React from 'react';
import './PostList.css';
import PostCard from '../PostCard/PostCard';

function PostList () {
    //Temp mock data
    const mockPosts = [
        {
            id:1,
            title: 'This is a post about cats',
            subreddit: 'r/aww',
            author: 'catlover92',
            comments: 888,
            score: 342,
        },
        {
            id:2,
            title: 'Ask Me Anything: Space engineer',
            subreddit: 'r/space',
            author: 'spacegeek',
            comments: 99,
            score: 701,
        },
    ];

    return (
        <div className='post-list'>
            {mockPosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

export default PostList;