import { getProblemsByTag } from './leetcode';

export interface TagStat {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

export const generateRecommendations = (tagStats: any) => {
  const allTags: TagStat[] = [
    ...tagStats.advanced,
    ...tagStats.intermediate,
    ...tagStats.fundamental
  ];

  // Sort by solved count (ascending) to find weak areas
  const weakTags = allTags
    .filter(tag => tag.problemsSolved < 20) // Consider "weak" if solved < 20
    .sort((a, b) => a.problemsSolved - b.problemsSolved);

  const recommendations = [];
  const topWeakTags = weakTags.slice(0, 3); // Pick top 3 weak topics

  for (const tag of topWeakTags) {
    const problems = getProblemsByTag(tag.tagSlug);
    // Add a mix of difficulties if available
    recommendations.push(...problems);
  }

  return recommendations.slice(0, 8); // Return top 8 recommendations
};
