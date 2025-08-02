import React from 'react';
import './SearchFilterBar.css';

function SearchFilterBar() {
    return (
        <div className='search-filter-bar'>
            <input
                type="text"
                placeholder="Search Posts..."
                className='search-input'
            />
            <select className='filter-dropdown'>
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