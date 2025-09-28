import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Ticker.css';
const API_URL = 'https://reddit-backend-clean.onrender.com';

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
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
        axios.get(`${API_URL}/api/posts/${randomSubreddit}`, {
          params: { limit: 8 }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 8000)
        )
      ]);

      const posts = response.data.posts.slice(0, 6).map(post => ({
        id: post.id,
        title: post.title.length > 80 ? post.title.substring(0, 80) + '...' : post.title,
        fullTitle: post.title,
        subreddit: post.subreddit,
        author: post.author,
        score: post.score,
        comments: post.comments,
        selftext: post.selftext,
        url: post.url,
        created_utc: post.created_utc,
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
        { id: 'f1', title: 'Cool cat memes are trending today', subreddit: 'funny', fullTitle: 'Cool cat memes are trending today - check them out!', author: 'unknown', score: 1234, comments: 56 },
        { id: 'f2', title: 'Shooting with a .50 calibre rifle safety tips', subreddit: 'videos', fullTitle: 'Safety tips for shooting with a .50 caliber rifle', author: 'unknown', score: 892, comments: 23 },
        { id: 'f3', title: 'Making microwave cake in 5 mins... what?!', subreddit: 'food', fullTitle: 'How to make a delicious microwave cake in just 5 minutes', author: 'unknown', score: 567, comments: 89 },
        { id: 'f4', title: "What's a lifehack that isn't obvious?", subreddit: 'AskReddit', fullTitle: "What's a lifehack that isn't obvious but everyone should know?", author: 'unknown', score: 2341, comments: 456 },
        { id: 'f5', title: 'Just finished FarCry 4! All time favourite game!', subreddit: 'gaming', fullTitle: 'Just finished Far Cry 4 and it\'s become my all-time favorite game!', author: 'unknown', score: 789, comments: 123 },
        { id: 'f6', title: 'Scrolling effects are super fun!', subreddit: 'webdev', fullTitle: 'Creating smooth scrolling effects with CSS and JavaScript', author: 'unknown', score: 445, comments: 67 },
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

  const handlePostClick = (post) => {
    if (post.isLoading) return; // Don't open modal for loading posts
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  // Format time ago
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'some time ago';
    const now = new Date();
    const postTime = new Date(timestamp * 1000);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <>
      <div className="ticker-container">
        {/* Loading posts - fade out during transition */}
        <div className={`ticker-content ${isTransitioning ? 'fading-out' : ''} ${showReal ? 'hidden' : ''}`}>
          {[...tickerPosts, ...tickerPosts].map((post, index) => (
            <div 
              className={`ticker-item ${post.isLoading ? 'loading-item' : 'clickable'}`} 
              key={`loading-${post.id}-${index}`}
              onClick={() => handlePostClick(post)}
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
              <div 
                className="ticker-item clickable" 
                key={`real-${post.id}-${index}`}
                onClick={() => handlePostClick(post)}
              >
                <span className="ticker-post-title">{post.title}</span>
                <span className="ticker-subreddit">r/{post.subreddit}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedPost && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPost.fullTitle || selectedPost.title}</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="post-info">
                <span className="modal-subreddit">r/{selectedPost.subreddit}</span>
                <span>Posted by u/{selectedPost.author}</span>
                <span>{getTimeAgo(selectedPost.created_utc)}</span>
              </div>
              
              {selectedPost.selftext && (
                <div className="post-text">
                  <p>{selectedPost.selftext}</p>
                </div>
              )}
              
              {selectedPost.url && selectedPost.url.match(/\.(jpg|jpeg|png|gif)$/i) && (
                <div className="post-image">
                  <img src={selectedPost.url} alt={selectedPost.title} />
                </div>
              )}
              
              <div className="post-stats">
                <span>⬆️ {selectedPost.score} points</span>
                <span>💬 {selectedPost.comments} comments</span>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-button" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Ticker;