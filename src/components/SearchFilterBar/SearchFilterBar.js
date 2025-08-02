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
                <option value="">Funny</option>
                <option value="">News</option>
                <option value="">Gaming</option>
                <option value="">Aww</option>
                <option value="">AskReddit</option>
            </select>
        </div>
    );
}

export default SearchFilterBar;