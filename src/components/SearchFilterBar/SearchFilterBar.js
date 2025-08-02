import React from 'react';
import './SearchFilterBar.css';

function SearchFilterBar({ searchTerm, setSearchTerm, filterCategory, setFilterCategory }) {
    return (
        <div className='search-filter-bar'>
            <input
                type="text"
                placeholder="Search Posts..."
                className='search-input'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
                className='filter-dropdown'
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                >
                <option value="">All Categories</option>
                <option value="funny">Funny</option>
                <option value="news">News</option>
                <option value="gaming">Gaming</option>
                <option value="aww">Aww</option>
                <option value="askreddit">AskReddit</option>
            </select>
        </div>
    );
}

export default SearchFilterBar;