import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Ticker.css';

function Ticker() {
  const [tickerPosts, setTickerPosts] = useState([
    // These show IMMEDIATELY - no delay
    { id: 'loading1', title: 'Getting you some cool content...', subreddit: 'loading', isLoading: true },
    { id: 'loading2', title: 'Fetching trending posts from Reddit', subreddit: 'please wait', isLoading: true },
    { id: 'loading3', title: 'Almost ready with fresh content!', subreddit: 'loading', isLoading: true },
  ]);
  const [realPosts, setRealPosts] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showReal, setShowReal] = useState(false);

  useEffect(() => {
    fetchTickerPosts();
  }, []);

  const fetchTickerPosts = async () => {
    try {
      // Let loading messages show for a bit
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const subreddits = ['showerthoughts', 'todayilearned', 'mildlyinteresting', 'lifeprotips', 'askreddit'];
      const randomSubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
      
      const response = await Promise.race([
        axios.get(`http://localhost:5000/api/posts/${randomSubreddit}`, {
          params: { limit: 8 }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 8000)
        )
      ]);

      const posts = response.data.posts.slice(0, 6).map(post => ({
        id: post.id,
        title: post.title.length > 80 ? post.title.substring(0, 80) + '...' : post.title,
        subreddit: post.subreddit,
        isLoading: false
      }));

      // Start the smooth transition
      setRealPosts(posts);
      setIsTransitioning(true);
      
      // After a short delay, complete the transition
      setTimeout(() => {
        setTickerPosts(posts);
        setShowReal(true);
        setIsTransitioning(false);
      }, 500);

    } catch (error) {
      console.error('Ticker fetch error:', error.message);
      // Smooth transition to fallback content
      const fallbackPosts = [
        { id: 'f1', title: 'Cool cat memes are trending today', subreddit: 'funny' },
        { id: 'f2', title: 'Shooting with a .50 calibre rifle safety tips', subreddit: 'videos' },
        { id: 'f3', title: 'Making microwave cake in 5 mins... what?!', subreddit: 'food' },
        { id: 'f4', title: "What's a lifehack that isn't obvious?", subreddit: 'AskReddit' },
        { id: 'f5', title: 'Just finished FarCry 4! All time favourite game!', subreddit: 'gaming' },
        { id: 'f6', title: 'Scrolling effects are super fun!', subreddit: 'webdev' },
      ];
      
      setRealPosts(fallbackPosts);
      setIsTransitioning(true);
      
      setTimeout(() => {
        setTickerPosts(fallbackPosts);
        setShowReal(true);
        setIsTransitioning(false);
      }, 500);
    }
  };

  return (
    <div className="ticker-container">
      {/* Loading posts - fade out during transition */}
      <div className={`ticker-content ${isTransitioning ? 'fading-out' : ''} ${showReal ? 'hidden' : ''}`}>
        {[...tickerPosts, ...tickerPosts].map((post, index) => (
          <div 
            className={`ticker-item ${post.isLoading ? 'loading-item' : ''}`} 
            key={`loading-${post.id}-${index}`}
          >
            <span className="ticker-post-title">{post.title}</span>
            <span className={`ticker-subreddit ${post.isLoading ? 'loading-subreddit' : ''}`}>
              {post.isLoading ? post.subreddit : `r/${post.subreddit}`}
            </span>
          </div>
        ))}
      </div>

      {/* Real posts - fade in during transition */}
      {realPosts.length > 0 && (
        <div className={`ticker-content real-content ${isTransitioning ? 'fading-in' : ''} ${showReal ? 'visible' : ''}`}>
          {[...realPosts, ...realPosts].map((post, index) => (
            <div className="ticker-item" key={`real-${post.id}-${index}`}>
              <span className="ticker-post-title">{post.title}</span>
              <span className="ticker-subreddit">r/{post.subreddit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Ticker;