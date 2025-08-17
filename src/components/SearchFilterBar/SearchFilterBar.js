import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../../features/posts/postsSlice';
import './SearchFilterBar.css';

function SearchFilterBar({ searchTerm, setSearchTerm, filterCategory, setFilterCategory }) {
    const dispatch = useDispatch();

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setFilterCategory(newCategory);

        //Fetch post from the selected subreddit
        dispatch(fetchPosts(newCategory));
    };

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
                onChange={handleCategoryChange}
                >
                <option value="">Popular (All)</option>
                <option value="funny">r/funny</option>
                <option value="programming">r/programming</option>
                <option value="gaming">r/gaming</option>
                <option value="aww">r/aww</option>
                <option value="news">r/news</option>
                <option value="worldnews">r/worldnews</option>
                <option value="technology">r/technology</option>
                <option value="movies">r/movies</option>
            </select>
        </div>
    );
}

export default SearchFilterBar;