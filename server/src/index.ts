import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchUserProfile, fetchUserTagStats, syncAllProblems } from './services/leetcode';
import { generateRecommendations } from './services/recommendation';
import db from './db/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/user/sync', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });
  if (username.length > 50) return res.status(400).json({ error: 'Username too long' });

  try {
    const profile = await fetchUserProfile(username);
    const tagStats = await fetchUserTagStats(username);

    if (!profile) return res.status(404).json({ error: 'User not found' });

    // Store in DB
    const stats = profile.submitStats.acSubmissionNum;
    const total = stats.find((s: any) => s.difficulty === 'All')?.count || 0;
    const easy = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
    const medium = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
    const hard = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;

    db.prepare(`
      INSERT OR REPLACE INTO users (username, total_solved, easy_solved, medium_solved, hard_solved, last_synced)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(username, total, easy, medium, hard);

    const recommendations = generateRecommendations(db, tagStats);

    res.json({
      profile: {
        username: profile.username,
        total,
        easy,
        medium,
        hard
      },
      tagStats,
      recommendations
    });
  } catch (error: any) {
    console.error('Sync Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to sync with LeetCode', 
      details: error.message 
    });
  }
});

app.patch('/api/recommendations/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    db.prepare('UPDATE recommendations SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // Sync problems on startup
  await syncAllProblems(db);
});
