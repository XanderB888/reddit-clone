const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors()); // Allow all orgigins

//API endpoint to get Reddit posts
app.get('/api/posts/:subreddit', async (requestAnimationFrame, res) => {
    const { subreddit } = requestAnimationFrame.params;
    try {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
        const data = await response.json();

        const posts = data.data.children.map((child) => ({
            id: child.data.id,
            title: child.data.title,
            subreddit: child.data.subreddit,
            author: child.data.author,
            comments: child.data.num_comments,
            score: child.data.score,
        }));

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));