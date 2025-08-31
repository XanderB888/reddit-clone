import React from 'react';
import './Header.css';

function Header({ 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  onCategoryChange 
}) {
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    console.log('🔄 Header: Category selected:', newCategory);
    onCategoryChange(newCategory);
  };

  return (
    <header className="header">
      <div className="logo">ReddeX</div>
      
      <div className="header-controls">
        <input
          type="text"
          placeholder="Search Reddit..."
          className="header-search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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