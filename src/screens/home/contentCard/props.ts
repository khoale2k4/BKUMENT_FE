export interface RecommendationReason {
    type: string;
    title: string;
}

export interface CardProp {
    id: string,
    title: string,
    coverImage: string,
    author: Author,
    type: 'DOC' | 'BLOG',
    time: string,
    content: string,
    tags: string[],
    onClick: (id: string) => void,
    token: string,
    views: number,
    recommendationReason?: RecommendationReason
}

interface Author {
    id: string,
    name: string,
    avatarUrl: string
}