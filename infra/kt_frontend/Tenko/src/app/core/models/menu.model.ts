export interface Menu {
    title: string;
    display: boolean;
    links: { label: string; path?: string; disabled: boolean }[]
}