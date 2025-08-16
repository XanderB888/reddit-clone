require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/auth/reddit', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.REDDIT_CLIENT_ID,
    response_type: 'code',
    state: 'random_string', // ideally generate securely
    redirect_uri: process.env.REDDIT_REDIRECT_URI,
    duration: 'permanent',
    scope: 'read identity'
  });

  res.redirect(`https://www.reddit.com/api/v1/authorize?${params.toString()}`);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No code provided');
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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    // Access & Refresh tokens from Reddit
    console.log('Tokens:', response.data);

    res.send('✅ Authorization successful! Check your terminal for tokens.');
  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);
    res.status(500).send('Error exchanging code');
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    // Just fetch public Reddit data (later we’ll use OAuth token)
    const response = await axios.get('https://www.reddit.com/r/popular.json');
    const posts = response.data.data.children.map((child) => ({
      id: child.data.id,
      title: child.data.title,
      subreddit: child.data.subreddit,
      author: child.data.author,
      comments: child.data.num_comments,
      score: child.data.score,
    }));
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Failed to load posts');
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
