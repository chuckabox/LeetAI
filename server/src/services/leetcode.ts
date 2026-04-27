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
export const getProblemsByTag = (tag: string) => {
  const mockProblems = {
    'array': [
      { id: '1', title: 'Two Sum', difficulty: 'Easy', tag: 'array' },
      { id: '15', title: '3Sum', difficulty: 'Medium', tag: 'array' },
      { id: '41', title: 'First Missing Positive', difficulty: 'Hard', tag: 'array' },
    ],
    'dynamic-programming': [
      { id: '70', title: 'Climbing Stairs', difficulty: 'Easy', tag: 'dynamic-programming' },
      { id: '322', title: 'Coin Change', difficulty: 'Medium', tag: 'dynamic-programming' },
      { id: '72', title: 'Edit Distance', difficulty: 'Hard', tag: 'dynamic-programming' },
    ],
    'string': [
        { id: '20', title: 'Valid Parentheses', difficulty: 'Easy', tag: 'string' },
        { id: '3', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tag: 'string' },
        { id: '76', title: 'Minimum Window Substring', difficulty: 'Hard', tag: 'string' },
    ],
    'tree': [
        { id: '104', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', tag: 'tree' },
        { id: '236', title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', tag: 'tree' },
        { id: '124', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', tag: 'tree' },
    ]
  };
  return mockProblems[tag as keyof typeof mockProblems] || mockProblems['array'];
};
