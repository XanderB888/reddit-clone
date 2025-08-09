import React from 'react';
import './PostList.css';
import PostCard from '../PostCard/PostCard';

function PostList ({ searchTerm, filterCategory }) {
    //Temp mock data
    const mockPosts = [
        {
            id:1,
            title: 'This is a post about cats',
            subreddit: 'aww',
            author: 'catlover92',
            comments: 888,
            score: 342,
        },
        {
            id:2,
            title: 'Ask Me Anything: Space engineer',
            subreddit: 'space',
            author: 'spacegeek',
            comments: 99,
            score: 701,
        },
        {
            id:3,
            title: 'Funniest Gaming Moments',
            subreddit: 'gaming',
            author: 'proGamer',
            comments: 44,
            score: 108,
        },
        {
            id:4,
            title: 'Ultimate Fails of 2025 July',
            subreddit: 'funny',
            author: 'UF Guy',
            comments: 288,
            score: 333,
        }
    ];

    const filteredPosts = mockPosts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const mathesCategory = filterCategory === '' || post.subreddit === filterCategory;
        return matchesSearch && mathesCategory;
    });

    return (
        <div className='post-list'>
            {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => <PostCard key={post.id} post={post} />) 
            ) : (
                <p>No posts match your criteria.</p>
            )}
        </div>
    );
}

export default PostList;