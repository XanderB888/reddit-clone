require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow all orgigins

const r = new snoowrap({
    userAgent: 'Reddit Clone Portfolio App',
    clientId: process.env.n39afMJTG-Gpw3-EJZjF4A,
    clientSecret: process.env.Q_T5I8s4ppg0xzA-Q20w2nU8O_KHIg,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

//Example endpoint to get Reddit posts
app.get('/api/posts/:subreddit', async (req, res) => {
    try {
        const { subreddit } = req.params;
        const posts = await r.getHot(subreddit, { limit:10 }); 
        res.json(posts.map(p => ({
            id: p.id,
            title: p.title,
            subreddit: p.subreddit.diplay_name,
            author: p.author.name,
            comments: p.num_comments,
            score: p.score
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));