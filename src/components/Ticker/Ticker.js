import React from 'react';
import './Ticker.css';

function Ticker() {
    //Placeholder data - replace with real radndom Reddit posts
    const randomPosts = [
        'Cool cat meme ^-^',
        'Shooting with a .50 calibre rifle',
        'Making microvawe cake in 5 mins... what!?',
        'What\'s a lifehack that isn\'t obvious?',
        'Just finished FarCry 4... All time favourite game!'
    ];

    return (
        <div className='ticker-container'>
            <div className='ticker'>
                {randomPosts.map((post, index) => (
                    <span className='ticker-item' key={index}>
                        {post}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default Ticker;
