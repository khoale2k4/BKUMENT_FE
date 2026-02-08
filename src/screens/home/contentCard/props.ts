export interface CardProp {
    id: string,
    title: string,
    coverImage: string,
    author: string,
    type: 'DOC' | 'BLOG',
    time: string,
    content: string,
    tags: string[],
    onClick: (id: string) => void,
    token: string
}