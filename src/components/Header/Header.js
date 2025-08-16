import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className='header'>
            <div className='logo'>ReddeX</div>
            <input type="text" className='search' placeholder='Search Reddit...' />
            <div className='menu icon'>☰</div> 
        </header>
    );
}

export default Header;