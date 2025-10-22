import { useMemo } from 'react';
import { Categoria } from 'src/types/Categoria';

/**
 * Hook per costruire l'albero gerarchico delle categorie
 * Ottimizzato con useMemo per ricalcolare solo quando le categorie cambiano
 */
export function useCategoryTree(categories: Categoria[] | undefined): Categoria[] {
  return useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];

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

/**
 * Hook per ottenere una lista flat di categorie con livelli di indentazione
 * Calcola il livello di profondità di ogni categoria basandosi sui parent
 */
export function useFlatCategoryList(categories: Categoria[] | undefined): Categoria[] {
  return useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories;
  }, [categories]);
}

/**
 * Hook per flatten l'albero delle categorie mantenendo l'ordine gerarchico
 * Ogni categoria avrà una proprietà 'level' che indica il livello di profondità
 * Le categorie sono ordinate in modo che ogni figlio appaia subito dopo il suo genitore
 */
export function useFlattenedCategoryTree(categories: Categoria[] | undefined): Array<Categoria & { level: number }> {
  return useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];

    // Crea una mappa per lookup veloce
    const categoryMap = new Map<number, Categoria>();
    categories.forEach((cat) => {
      if (cat.id) {
        categoryMap.set(cat.id, cat);
      }
    });

    // Funzione per calcolare il livello di una categoria
    const getLevel = (cat: Categoria, visited = new Set<number>()): number => {
      // Previeni loop infiniti
      if (cat.id && visited.has(cat.id)) return 0;
      if (cat.id) visited.add(cat.id);

      if (!cat.parent || cat.parent === 0) return 0;

      const parentCat = categoryMap.get(cat.parent);
      if (!parentCat) return 0;

      return 1 + getLevel(parentCat, visited);
    };

    // Trova tutte le categorie root (senza parent o parent = 0)
    const rootCategories = categories.filter((cat) => !cat.parent || cat.parent === 0);

    // Funzione ricorsiva per flatten l'albero in ordine depth-first
    const flattenTree = (parentId: number | null, level: number): Array<Categoria & { level: number }> => {
      // Trova tutte le categorie che hanno questo parent
      const children = categories
        .filter((cat) => cat.parent === parentId)
        .sort((a, b) => (a.id || 0) - (b.id || 0)); // Ordina per ID

      const result: Array<Categoria & { level: number }> = [];

      for (const child of children) {
        // Aggiungi la categoria corrente
        result.push({ ...child, level });

        // Aggiungi ricorsivamente tutti i figli
        if (child.id) {
          result.push(...flattenTree(child.id, level + 1));
        }
      }

      return result;
    };

    // Inizia dalle root categories
    const result: Array<Categoria & { level: number }> = [];

    // Ordina le root per ID
    const sortedRoots = rootCategories.sort((a, b) => (a.id || 0) - (b.id || 0));

    for (const root of sortedRoots) {
      // Aggiungi la root
      result.push({ ...root, level: 0 });

      // Aggiungi tutti i suoi discendenti
      if (root.id) {
        result.push(...flattenTree(root.id, 1));
      }
    }

    return result;
  }, [categories]);
}

