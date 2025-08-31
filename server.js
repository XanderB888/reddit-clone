require('dotenv').config({ path: 'sec.env' });
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// Store current access token in memory
let currentAccessToken = null;
let tokenExpiry = null;

/**
 * Get a fresh access token using refresh token
 */
async function getAccessToken() {
  if (currentAccessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return currentAccessToken;
  }

  try {
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.REDDIT_REFRESH_TOKEN,
      }),
      {
        auth: {
          username: process.env.REDDIT_CLIENT_ID,
          password: process.env.REDDIT_CLIENT_SECRET,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    currentAccessToken = response.data.access_token;
    tokenExpiry = Date.now() + (50 * 60 * 1000);
    
    console.log('🔑 Got fresh access token');
    return currentAccessToken;
  } catch (error) {
    console.error('❌ Error getting access token:', error.response?.data || error.message);
    throw error;
  }
}

// OAuth routes
app.get('/auth/reddit', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.REDDIT_CLIENT_ID,
    response_type: 'code',
    state: 'randomString123',
    redirect_uri: process.env.REDDIT_REDIRECT_URI,
    duration: 'permanent',
    scope: 'read identity',
  });

  const authUrl = `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
  res.redirect(authUrl);
});

app.get('/auth/reddit/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDDIT_REDIRECT_URI,
      }),
      {
        auth: {
          username: process.env.REDDIT_CLIENT_ID,
          password: process.env.REDDIT_CLIENT_SECRET,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    console.log('✅ Tokens:', response.data);
    res.send('Authorization successful! Check your terminal for tokens.');
  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);
    res.status(500).send('Error exchanging code');
  }
});

// API routes
app.get('/api/posts', async (req, res) => {
  try {
    const { after, limit = 25 } = req.query;
    const accessToken = await getAccessToken();

    const response = await axios.get('https://oauth.reddit.com/r/popular/hot', {
      headers: {
        'Authorization': `bearer ${accessToken}`,
        'User-Agent': 'ReddeX:v1.0 (by /u/General_WickedSnail)'
      },
      params: {
        limit: parseInt(limit),
        after: after || undefined
      }
    });

    const posts = response.data.data.children.map((child) => ({
      id: child.data.id,
      title: child.data.title,
      subreddit: child.data.subreddit,
      author: child.data.author,
      comments: child.data.num_comments,
      score: child.data.score,
      thumbnail: child.data.thumbnail !== 'self' && child.data.thumbnail !== 'default' 
        ? child.data.thumbnail : null,
      url: child.data.url,
      selftext: child.data.selftext,
      created_utc: child.data.created_utc,
      preview: child.data.preview || null
    }));

    console.log(`📥 Fetched ${posts.length} posts from r/popular`);
    
    res.json({
      posts: posts,
      after: response.data.data.after // Next page token
    });
  } catch (error) {
    console.error('❌ Error fetching posts:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

app.get('/api/posts/:subreddit', async (req, res) => {
  try {
    const subreddit = req.params.subreddit;
    const { after, limit = 25 } = req.query;
    const accessToken = await getAccessToken();

    const response = await axios.get(`https://oauth.reddit.com/r/${subreddit}/hot`, {
      headers: {
        'Authorization': `bearer ${accessToken}`,
        'User-Agent': 'ReddeX:v1.0 (by /u/General_WickedSnail)'
      },
      params: {
        limit: parseInt(limit),
        after: after || undefined
      }
    });

    const posts = response.data.data.children.map((child) => ({
      id: child.data.id,
      title: child.data.title,
      subreddit: child.data.subreddit,
      author: child.data.author,
      comments: child.data.num_comments,
      score: child.data.score,
      thumbnail: child.data.thumbnail !== 'self' && child.data.thumbnail !== 'default' 
        ? child.data.thumbnail : null,
      url: child.data.url,
      selftext: child.data.selftext,
      created_utc: child.data.created_utc,
      preview: child.data.preview || null
    }));

    console.log(`📥 Fetched ${posts.length} posts from r/${subreddit}`);
    
    res.json({
      posts: posts,
      after: response.data.data.after // Next page token
    });
  } catch (error) {
    console.error('❌ Error fetching posts:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q, limit = 25, after } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const accessToken = await getAccessToken();

    const response = await axios.get('https://oauth.reddit.com/search', {
      headers: {
        'Authorization': `bearer ${accessToken}`,
        'User-Agent': 'ReddeX:v1.0 (by /u/General_WickedSnail)'
      },
      params: {
        q: q.trim(),
        type: 'link',
        sort: 'relevance',
        limit: parseInt(limit),
        after: after || undefined
      }
    });

    const posts = response.data.data.children.map((child) => ({
      id: child.data.id,
      title: child.data.title,
      subreddit: child.data.subreddit,
      author: child.data.author,
      comments: child.data.num_comments,
      score: child.data.score,
      thumbnail: child.data.thumbnail !== 'self' && child.data.thumbnail !== 'default' 
        ? child.data.thumbnail : null,
      url: child.data.url,
      selftext: child.data.selftext,
      created_utc: child.data.created_utc,
      preview: child.data.preview || null
    }));

    console.log(`🔍 Search for "${q}" returned ${posts.length} posts`);
    
    res.json({
      posts: posts,
      after: response.data.data.after,
      query: q.trim()
    });
  } catch (error) {
    console.error('❌ Error searching posts:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));