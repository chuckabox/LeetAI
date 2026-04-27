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
  const mockProblems: Record<string, any[]> = {
    'array': [
      { id: '1', title: 'Two Sum', difficulty: 'Easy', tag: 'array' },
      { id: '15', title: '3Sum', difficulty: 'Medium', tag: 'array' },
      { id: '41', title: 'First Missing Positive', difficulty: 'Hard', tag: 'array' },
      { id: '26', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', tag: 'array' },
      { id: '11', title: 'Container With Most Water', difficulty: 'Medium', tag: 'array' },
    ],
    'dynamic-programming': [
      { id: '70', title: 'Climbing Stairs', difficulty: 'Easy', tag: 'dynamic-programming' },
      { id: '322', title: 'Coin Change', difficulty: 'Medium', tag: 'dynamic-programming' },
      { id: '72', title: 'Edit Distance', difficulty: 'Hard', tag: 'dynamic-programming' },
      { id: '198', title: 'House Robber', difficulty: 'Medium', tag: 'dynamic-programming' },
      { id: '5', title: 'Longest Palindromic Substring', difficulty: 'Medium', tag: 'dynamic-programming' },
    ],
    'string': [
        { id: '20', title: 'Valid Parentheses', difficulty: 'Easy', tag: 'string' },
        { id: '3', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tag: 'string' },
        { id: '76', title: 'Minimum Window Substring', difficulty: 'Hard', tag: 'string' },
        { id: '242', title: 'Valid Anagram', difficulty: 'Easy', tag: 'string' },
    ],
    'tree': [
        { id: '104', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', tag: 'tree' },
        { id: '236', title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', tag: 'tree' },
        { id: '124', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', tag: 'tree' },
        { id: '102', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', tag: 'tree' },
    ],
    'graph': [
        { id: '200', title: 'Number of Islands', difficulty: 'Medium', tag: 'graph' },
        { id: '133', title: 'Clone Graph', difficulty: 'Medium', tag: 'graph' },
        { id: '207', title: 'Course Schedule', difficulty: 'Medium', tag: 'graph' },
        { id: '785', title: 'Is Graph Bipartite?', difficulty: 'Medium', tag: 'graph' },
    ]
  };
  return mockProblems[tag] || mockProblems['array'];
};
