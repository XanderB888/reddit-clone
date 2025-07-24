import React from 'react';
import './Ticker.css';

function Ticker() {
    //Placeholder data - replace with real radndom Reddit posts
    const randomPosts = [
        'Cool cat meme ^-^',
        'Shooting with a .50 calibre rifle',
        'Making microvawe cake in 5 mins... what!?',
        'What\'s a lifehack that isn\'t obvious?',
        'Just finished FarCry 4! All time favourite game!',
        'Scrolling effects are super fun!',
        'Debates spark as US and Russia discuss nuclear power plants in the ocean.',
        'AI is slowly taking over and it is not neccesarily a bad thing.'
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
