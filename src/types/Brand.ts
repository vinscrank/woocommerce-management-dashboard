export interface Brand {
    id: number;
    name: string;
    slug: string;
    parent: number | null;
    description: string;
    image: string | null;
    menuOrder: number;
    count: number;
}





