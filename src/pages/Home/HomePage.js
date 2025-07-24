import React from 'react';
import Header from '../../components/Header/Header';
import Ticker from '../../components/Ticker/Ticker';

function HomePage() {
    return (
        <>
            <Header />
            <Ticker />
            <main style={{ padding: '2rem'}}>
                <h2>Main feed</h2>
            </main>
        </>
    );
}

export default HomePage;