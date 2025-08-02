import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Ticker from '../../components/Ticker/Ticker';
import PostList from '../../components/PostList/PostList';
import SearchFilterBar from '../../components/SearchFilterBar/SearchFilterBar';

function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    return (
        <>
            <Header />
            <Ticker />
            <main style={{ padding: '2rem'}}>
                <SearchFilterBar 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                />
                <PostList 
                    searchTerm={searchTerm}
                    filterCategory={filterCategory}
                />
            </main>
        </>
    );
}

export default HomePage;