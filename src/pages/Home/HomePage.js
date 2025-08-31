import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../features/posts/postsSlice';
import Header from '../../components/Header/Header';
import Ticker from '../../components/Ticker/Ticker';
import PostList from '../../components/PostList/PostList';
import './HomePage.css';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const dispatch = useDispatch();
  
  // Get posts from Redux store
  const { items: allPosts, status, isSearchMode, currentQuery } = useSelector((state) => state.posts);
  
  // Debug: Log the current state
  console.log('🏠 HomePage state:', { 
    postsCount: allPosts.length, 
    status, 
    filterCategory,
    isSearchMode,
    currentQuery
  });
  
  // No local filtering needed - posts come from Redux already filtered
  const displayPosts = allPosts;

  // Handle category change and fetch from API
  const handleCategoryChange = (newCategory) => {
    console.log('🔄 HomePage: Category changing to:', newCategory);
    setFilterCategory(newCategory);
    
    // Dispatch to Redux
    console.log('🚀 HomePage: Dispatching fetchPosts');
    dispatch(fetchPosts({ subreddit: newCategory }));
  };

  return (
    <div className="homepage-container">
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        onCategoryChange={handleCategoryChange}
      />
      <Ticker />
      <main className="main-content">
        {/* Show search info */}
        {isSearchMode && currentQuery && (
          <div className="search-info">
            <p>Search results for: <strong>"{currentQuery}"</strong></p>
          </div>
        )}
        
        <PostList
          posts={displayPosts}
          status={status}
        />
      </main>
    </div>
  );
}

export default HomePage;

