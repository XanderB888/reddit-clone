import React from 'react';
import Header from '../../components/Header/Header';
import Ticker from '../../components/Ticker/Ticker';
import PostList from '../../components/PostList/PostList';
import SearchFilterBar from '../../components/SearchFilterBar/SearchFilterBar';

function HomePage() {
    return (
        <>
            <Header />
            <Ticker />
            <main style={{ padding: '2rem'}}>
                <SearchFilterBar />
                <PostList />
            </main>
        </>
    );
}

export default HomePage;