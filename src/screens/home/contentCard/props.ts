export interface CardProp {
    id: string,
    title: string,
    assets: string[],
    author: string,
    time: string,
    content: string,
    tags: string[],
    onClick: (id: string) => void,
}