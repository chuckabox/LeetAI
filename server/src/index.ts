import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchUserProfile, fetchUserTagStats } from './services/leetcode';
import { generateRecommendations } from './services/recommendation';
import db from './db/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/user/sync', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

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

    const recommendations = generateRecommendations(tagStats);

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
