const express = require('express');
const session = require('express-session');
const passport = require('passport');
const RedditStrategy = require('passport-reddit').Strategy;
const axios = require('axios');
const cors = require('cors');
require('dotenv').config({ path: './sec.env' });

const app = express();

// CORS configuration for production
app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'https://reddit-clone-rust-eta.vercel.app' // My Vercel URL
  ],
  credentials: true
}));

app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Reddit Strategy
passport.use(new RedditStrategy({
    clientID: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    callbackURL: process.env.REDDIT_REDIRECT_URI || "/auth/reddit/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Store tokens in session or database
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Global access token storage (in production, use Redis or database)
let globalAccessToken = null;

// Function to get access token
async function getAccessToken() {
  if (globalAccessToken) {
    return globalAccessToken;
  }

  try {
    const auth = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post('https://www.reddit.com/api/v1/access_token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'User-Agent': process.env.REDDIT_USER_AGENT,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    globalAccessToken = response.data.access_token;
    console.log('Got fresh access token');
    
    // Refresh token before it expires
    setTimeout(() => {
      globalAccessToken = null;
    }, (response.data.expires_in - 300) * 1000); // Refresh 5 minutes before expiry

    return globalAccessToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Reddit Clone API is running!', status: 'healthy' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get posts from a specific subreddit or popular
app.get('/api/posts/:subreddit?', async (req, res) => {
  try {
    const subreddit = req.params.subreddit || 'popular';
    const accessToken = await getAccessToken();

    const response = await axios.get(`https://oauth.reddit.com/r/${subreddit}/hot`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': process.env.REDDIT_USER_AGENT
      },
      params: {
        limit: 25
      }
    });

    const posts = response.data.data.children.map(child => ({
      id: child.data.id,
      title: child.data.title,
      author: child.data.author,
      score: child.data.score,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      url: child.data.url,
      selftext: child.data.selftext,
      subreddit: child.data.subreddit,
      permalink: child.data.permalink,
      thumbnail: child.data.thumbnail !== 'self' ? child.data.thumbnail : null
    }));

    console.log(`Fetched ${posts.length} posts from r/${subreddit}`);
    res.json({ posts, subreddit });

  } catch (error) {
    console.error('Error fetching posts:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Search posts
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length > 100) {
      return res.status(400).json({ error: 'Invalid search query' });
    }

    const accessToken = await getAccessToken();

    const response = await axios.get('https://oauth.reddit.com/search', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': process.env.REDDIT_USER_AGENT
      },
      params: {
        q: query,
        type: 'link',
        limit: 25
      }
    });

    const posts = response.data.data.children.map(child => ({
      id: child.data.id,
      title: child.data.title,
      author: child.data.author,
      score: child.data.score,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      url: child.data.url,
      selftext: child.data.selftext,
      subreddit: child.data.subreddit,
      permalink: child.data.permalink,
      thumbnail: child.data.thumbnail !== 'self' ? child.data.thumbnail : null
    }));

    console.log(`Found ${posts.length} posts for query: ${query}`);
    res.json({ posts, query });

  } catch (error) {
    console.error('Error searching posts:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

// Auth routes (optional - for future user authentication)
app.get('/auth/reddit', passport.authenticate('reddit', {
  state: 'random-state-string',
  duration: 'permanent'
}));

app.get('/auth/reddit/callback', 
  passport.authenticate('reddit', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
  }
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Initialize access token on startup
getAccessToken().catch(console.error);