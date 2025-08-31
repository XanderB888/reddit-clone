import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { searchPosts, clearSearch } from '../../features/posts/postsSlice';
import './Header.css';

function Header({ 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  onCategoryChange 
}) {
  const dispatch = useDispatch();
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Debounced search effect
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // If search term is empty, clear search
    if (searchTerm.trim() === '') {
      dispatch(clearSearch());
      return;
    }

    // If search term is too short, don't search
    if (searchTerm.trim().length < 2) {
      return;
    }

    // Set new timeout for search
    const timeout = setTimeout(() => {
      console.log('🔍 Searching for:', searchTerm);
      dispatch(searchPosts({ query: searchTerm }));
    }, 800); // Wait 800ms after user stops typing

    setSearchTimeout(timeout);

    // Cleanup
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchTerm, dispatch]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    console.log('🔄 Header: Category selected:', newCategory);
    
    // Clear search when changing categories
    if (searchTerm) {
      setSearchTerm('');
      dispatch(clearSearch());
    }
    
    onCategoryChange(newCategory);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If user clears search, immediately clear results
    if (value.trim() === '') {
      dispatch(clearSearch());
    }
  };

  return (
    <header className="header">
      <div className="logo">ReddeX</div>
      
      <div className="header-controls">
        <input
          type="text"
          placeholder="Search all of Reddit..."
          className="header-search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <select
          className="header-filter-dropdown"
          value={filterCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Popular (All)</option>
          <option value="funny">r/funny</option>
          <option value="programming">r/programming</option>
          <option value="aww">r/aww</option>
          <option value="gaming">r/gaming</option>
          <option value="news">r/news</option>
          <option value="worldnews">r/worldnews</option>
          <option value="technology">r/technology</option>
          <option value="movies">r/movies</option>
        </select>
      </div>
      
      <div className="header-menu">
        <div className="menu-icon">☰</div>
      </div>
    </header>
  );
}

export default Header;