import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Ticker.css';

function Ticker() {
  const [tickerPosts, setTickerPosts] = useState([
    // Immediate fallback content - shows instantly
    { id: 'f1', title: 'Cool cat memes are trending today', subreddit: 'funny' },
    { id: 'f2', title: 'Shooting with a .50 calibre rifle safety tips', subreddit: 'videos' },
    { id: 'f3', title: 'Making microwave cake in 5 mins... what?!', subreddit: 'food' },
    { id: 'f4', title: "What's a lifehack that isn't obvious?", subreddit: 'AskReddit' },
    { id: 'f5', title: 'Just finished FarCry 4! All time favourite game!', subreddit: 'gaming' },
    { id: 'f6', title: 'Scrolling effects are super fun!', subreddit: 'webdev' },
  ]);
  const [loading, setLoading] = useState(false); // Start as false since we have fallback

  useEffect(() => {
    // Fetch real posts but don't block the UI
    fetchTickerPosts();
    
    // Also refresh every 60 seconds
    const interval = setInterval(fetchTickerPosts, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickerPosts = async () => {
    try {
      setLoading(true);
      
      // Fetch from multiple subreddits for variety
      const subreddits = ['showerthoughts', 'todayilearned', 'mildlyinteresting', 'lifeprotips', 'askreddit'];
      const randomSubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
      
      // Add timeout to prevent long waits
      const response = await Promise.race([
        axios.get(`http://localhost:5000/api/posts/${randomSubreddit}`, {
          params: { limit: 8 }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);

      // Extract just the titles and subreddit info
      const posts = response.data.posts.slice(0, 6).map(post => ({
        id: post.id,
        title: post.title.length > 80 ? post.title.substring(0, 80) + '...' : post.title,
        subreddit: post.subreddit
      }));

      setTickerPosts(posts);
      setLoading(false);
    } catch (error) {
      console.error('Ticker fetch error:', error.message);
      // Keep the fallback content on error
      setLoading(false);
    }
  };

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
      
      {loading && (
        <div className="ticker-refresh-indicator">
          Refreshing...
        </div>
      )}
    </div>
  );
}

export default Ticker;

