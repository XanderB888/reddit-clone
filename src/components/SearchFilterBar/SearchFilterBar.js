import React from 'react';
import './SearchFilterBar.css';

function SearchFilterBar({ searchTerm, setSearchTerm, filterCategory, onCategoryChange }) {
  
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    //console.log('🔄 SearchFilterBar: Category selected:', newCategory); //debug console.log statements used for debugging
    
    // Call the parent's handler
    onCategoryChange(newCategory);  // Changed this line
  };

  return (
    <div className="search-filter-bar">
      <input
        type="text"
        placeholder="Search posts..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="filter-dropdown"
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
  );
}

export default SearchFilterBar;