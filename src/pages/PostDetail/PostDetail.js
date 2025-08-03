import React from 'react';
import { useParams } from 'react-router-dom';
import './PostDetail.css';

function PostDetail() {
    const { id } = useParams();

    //Later we'll fetch actual post data from API or Redux store
    return (
        <div className='post-detail'>
            <h1>Post Details</h1>
            <p>Post ID: {id}</p>
            {/*Replace with real post data later*/}
        </div>
    );
}

export default PostDetail;