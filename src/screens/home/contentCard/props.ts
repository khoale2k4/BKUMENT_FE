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
    views: number
}

interface Author {
    id: string,
    name: string,
    avatarUrl: string
}