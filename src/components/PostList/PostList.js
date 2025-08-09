import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPosts } from '../../features/posts/postsSlice';
import './PostList.css';
import PostCard from '../PostCard/PostCard';

function PostList () {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.items);
    
    useEffect(() => {
        //Temp mock posts untill I connect the Reddit API
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

    dispatch(setPosts(mockPosts));
    }, [dispatch]);   

    return (
        <div className='post-list'>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

export default PostList;