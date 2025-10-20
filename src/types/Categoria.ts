//     import { LastSync } from "./Sync"

import { components } from "./Global";

export type Categoria = components["schemas"]["Category"] & {
    parent?: number;
    description?: string;
    display?: string;
    image?: Immagine | null;
    menuOrder?: number;
    count?: number;
    children?: Categoria[];
};

// export interface Categoria {
//     id: number
//     name: string
//     slug: string
//     parent: number
//     description: string
//     display: string
//     menu_order: number
//     count: number
//     label: string
//     key: number
//     on_sale: boolean
//     date_on_sale_to: any
//     date_on_sale_from: any
//     sale_percentage: any
//     children: any[]
//     created_at_con_ora: string
//     last_sync: LastSync
//     last_export: any
//     numeroProdotti: any
//     genitore: Genitore
//     immagine: Immagine
// }


// export interface Genitore {
//     id: number
//     name: string
//     slug: string
//     parent: number
//     description: string
//     display: string
//     menu_order: number
//     count: number
//     on_sale: any
//     date_on_sale_to: any
//     date_on_sale_from: any
//     sale_percentage: any
//     created_at: string
//     updated_at: string
//     sincronizzazione_id: number
//     export_id: any
// }

export interface Immagine {
    id: number
    categoria_id: number | null
    src: string
    name: string
    alt: string
    created_at?: string
    updated_at?: string
    file?: File | null
}
