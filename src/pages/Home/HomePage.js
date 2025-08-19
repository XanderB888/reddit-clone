import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../features/posts/postsSlice';
import Header from '../../components/Header/Header';
import Ticker from '../../components/Ticker/Ticker';
import SearchFilterBar from '../../components/SearchFilterBar/SearchFilterBar';
import PostList from '../../components/PostList/PostList';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const dispatch = useDispatch();
  
  // Get posts from Redux store
  const { items: allPosts, status } = useSelector((state) => state.posts);
  
  // Debug: Log the current state
  console.log('HomePage state:', { 
    postsCount: allPosts.length, 
    status, 
    filterCategory 
  });
  
  // Filter posts based on search term only (not category, since we fetch by category)
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handle category change and fetch from API
  const handleCategoryChange = (newCategory) => {
    console.log('HomePage: Category changing to:', newCategory);
    setFilterCategory(newCategory);
    
    // Dispatch to Redux
    console.log('HomePage: Dispatching fetchPosts');
    dispatch(fetchPosts(newCategory));
  };

  return (
    <>
      <Header />
      <Ticker />
      <main style={{ padding: '2rem' }}>
        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          onCategoryChange={handleCategoryChange}  // Changed this line
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