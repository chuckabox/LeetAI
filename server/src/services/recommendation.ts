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

  const recommendations: any[] = [];
  const topWeakTags = weakTags.slice(0, 4); // Pick top 4 weak topics

  for (const tag of topWeakTags) {
    const problems = getProblemsByTag(tag.tagSlug);
    recommendations.push(...problems);
  }

  // Deduplicate by ID and limit
  const seenIds = new Set();
  const uniqueRecommendations = recommendations.filter(p => {
    if (seenIds.has(p.id)) return false;
    seenIds.add(p.id);
    return true;
  });

  return uniqueRecommendations.slice(0, 8);
};
