import axios from 'axios';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

export const fetchUserProfile = async (username: string) => {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(LEETCODE_GRAPHQL_URL, {
      query,
      variables: { username },
    });
    return response.data.data.matchedUser;
  } catch (error) {
    console.error('Error fetching LeetCode profile:', error);
    return null;
  }
};

export const fetchUserTagStats = async (username: string) => {
  const query = `
    query userTagProgress($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced {
            tagName
            tagSlug
            problemsSolved
          }
          intermediate {
            tagName
            tagSlug
            problemsSolved
          }
          fundamental {
            tagName
            tagSlug
            problemsSolved
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(LEETCODE_GRAPHQL_URL, {
      query,
      variables: { username },
    });
    return response.data.data.matchedUser?.tagProblemCounts;
  } catch (error) {
    console.error('Error fetching LeetCode tag stats:', error);
    return null;
  }
};

// Mock function for problem suggestions based on tags
// In a real app, you'd have a database of LeetCode problems
export const syncAllProblems = async (db: any) => {
  const query = `
    query problemsetQuestionList($limit: Int) {
      problemsetQuestionList: questionList(
        categorySlug: ""
        limit: $limit
        skip: 0
        filters: {}
      ) {
        data {
          questionId
          questionFrontendId
          title
          titleSlug
          difficulty
          topicTags {
            slug
          }
        }
      }
    }
  `;

  try {
    console.log('Fetching all problems from LeetCode...');
    const response = await axios.post(LEETCODE_GRAPHQL_URL, {
      query,
      variables: { limit: 1000 }, // Fetch top 1000 problems for now
    });

    const questions = response.data.data.problemsetQuestionList.data;
    const insert = db.prepare(`
      INSERT OR REPLACE INTO problems (id, frontend_id, title, title_slug, difficulty, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((qs: any[]) => {
      for (const q of qs) {
        insert.run(
          q.questionId,
          q.questionFrontendId,
          q.title,
          q.titleSlug,
          q.difficulty,
          JSON.stringify(q.topicTags.map((t: any) => t.slug))
        );
      }
    });

    transaction(questions);
    console.log(`Synced ${questions.length} problems to database.`);
  } catch (error) {
    console.error('Error syncing problems:', error);
  }
};

export const getProblemsByTag = (db: any, tag: string) => {
  const problems = db.prepare(`
    SELECT * FROM problems 
    WHERE tags LIKE ?
    ORDER BY RANDOM()
    LIMIT 5
  `).all(`%${tag}%`);

  return problems.map((p: any) => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    tag: tag
  }));
};

