import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import Ticker from '../../components/Ticker/Ticker';
import PostList from '../../components/PostList/PostList';
import SearchFilterBar from '../../components/SearchFilterBar/SearchFilterBar';

function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    //Get posts from Reddux store
    const { items: allPosts, status } = useSelector((state) => state.posts);

    //Filter posts based on search term and category
    const filteredPosts = allPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || post.subreddit.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

    return (
        <>
            <Header />
            <Ticker />
            <main style={{ padding: '2rem'}}>
                <SearchFilterBar 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                />
                <PostList 
                    posts={filteredPosts}
                    status={status}
                />
            </main>
        </>
    );
}

export default HomePage;