// OpinionSortType.ts
export const SortType = {
    Latest: 'latest',
    Likes: 'likes',
    Comments: 'comments',
} as const;

export type SortType = typeof SortType[keyof typeof SortType];
