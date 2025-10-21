import { useMemo } from 'react';
import { Categoria } from 'src/types/Categoria';

/**
 * Hook per costruire l'albero gerarchico delle categorie
 * Ottimizzato con useMemo per ricalcolare solo quando le categorie cambiano
 */
export function useCategoryTree(categories: Categoria[] | undefined): Categoria[] {
  return useMemo(() => {
    if (!categories) return [];

    const categoryMap = new Map<number, Categoria>();
    const rootCategories: Categoria[] = [];

    // Prima passata: crea la mappa e inizializza l'array children
    categories.forEach((cat) => {
      if (cat.id) {
        categoryMap.set(cat.id, { ...cat, children: [] });
      }
    });

    // Seconda passata: costruisci la gerarchia
    categoryMap.forEach((cat) => {
      if (cat.parent && cat.parent !== 0) {
        const parentCat = categoryMap.get(cat.parent);
        if (parentCat) {
          // Ha un parent valido, aggiungilo come child
          parentCat.children!.push(cat);
        } else {
          // Parent non trovato, mettilo nelle root
          rootCategories.push(cat);
        }
      } else {
        // Nessun parent, è una categoria root
        rootCategories.push(cat);
      }
    });

    return rootCategories;
  }, [categories]);
}

