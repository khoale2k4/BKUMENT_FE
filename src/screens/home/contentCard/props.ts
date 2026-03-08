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
    token: string
}

interface Author {
    id: string,
    name: string,
    avatarUrl: string
}