import React, { useState, useEffect, useRef } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
      if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Searching for:', searchTerm);
            }
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Header: Category selected:', newCategory);
          }
    
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (action) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('Menu item clicked:', action);
          }
    setIsMenuOpen(false); 
    
    // Handle different menu actions
    switch (action) {
      case 'profile':
        // Navigate to profile or handle profile logic
        break;
      case 'settings':
        // Navigate to settings or handle settings logic
        break;
      case 'saved':
        // Navigate to saved posts
        break;
      case 'history':
        // Navigate to history
        break;
      case 'about':
        // Navigate to about page
        break;
      case 'logout':
        // Handle logout logic
        break;
      default:
        break;
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
      
      <div className="header-menu" ref={menuRef}>
        <div className="menu-icon" onClick={toggleMenu}>
          ☰
        </div>
        
        {isMenuOpen && (
          <div className="menu-dropdown">
            <div className="menu-item" onClick={() => handleMenuItemClick('profile')}>
              👤 My Profile
            </div>
            <div className="menu-item" onClick={() => handleMenuItemClick('saved')}>
              🔖 Saved Posts
            </div>
            <div className="menu-item" onClick={() => handleMenuItemClick('history')}>
              📜 History
            </div>
            <div className="menu-separator"></div>
            <div className="menu-item" onClick={() => handleMenuItemClick('settings')}>
              ⚙️ Settings
            </div>
            <div className="menu-item" onClick={() => handleMenuItemClick('about')}>
              ℹ️ About
            </div>
            <div className="menu-separator"></div>
            <div className="menu-item logout" onClick={() => handleMenuItemClick('logout')}>
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;