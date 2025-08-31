import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Ticker.css';

function Ticker() {
  const [tickerPosts, setTickerPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickerPosts();
  }, []);

  const fetchTickerPosts = async () => {
    try {
      setLoading(true);
      
      // Fetch from multiple subreddits for variety
      const subreddits = ['showerthoughts', 'todayilearned', 'mildlyinteresting', 'lifeprotips'];
      const randomSubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
      
      const response = await axios.get(`http://localhost:5000/api/posts/${randomSubreddit}`, {
        params: {
          limit: 10 // Get 10 posts for ticker
        }
      });

      // Extract just the titles and subreddit info
      const posts = response.data.posts.slice(0, 8).map(post => ({
        id: post.id,
        title: post.title.length > 80 ? post.title.substring(0, 80) + '...' : post.title,
        subreddit: post.subreddit
      }));

      setTickerPosts(posts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ticker posts:', error);
      // Fallback to static content if API fails
      setTickerPosts([
        { id: 1, title: 'Cool cat memes are trending today', subreddit: 'funny' },
        { id: 2, title: 'Shooting with a .50 calibre rifle safety tips', subreddit: 'videos' },
        { id: 3, title: 'Making microwave cake in 5 mins... what?!', subreddit: 'food' },
        { id: 4, title: "What's a lifehack that isn't obvious?", subreddit: 'AskReddit' },
        { id: 5, title: 'Just finished FarCry 4! All time favourite game!', subreddit: 'gaming' },
      ]);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ticker-container">
        <div className="ticker-loading">Loading trending posts...</div>
      </div>
    );
  }

  return (
    <div className="ticker-container">
      <div className="ticker-content">
        {/* Duplicate the posts to create seamless loop */}
        {[...tickerPosts, ...tickerPosts].map((post, index) => (
          <div className="ticker-item" key={`${post.id}-${index}`}>
            <span className="ticker-post-title">{post.title}</span>
            <span className="ticker-subreddit">r/{post.subreddit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ticker;