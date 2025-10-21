import { components } from "./Global";

// import { ProdottoAttributo } from "./ProdottoAttributo"
export type Prodotto = components["schemas"]["WooCommerceProductResponse"] & {
  metaData?: Array<{ id?: number; key: string; value: string }>;
  brands?: Array<{ id: number; name?: string; slug?: string }>; // Brand associati
};

