# usePaginatedSelect - Hook Generico per Select Paginate

Hook React generico per gestire l'accumulazione di elementi paginati in select/multiselect con pulsante "Carica altro".

## Caratteristiche

- ✅ **Generico e riutilizzabile** - Funziona con qualsiasi tipo di dato
- ✅ **Accumulo automatico** - Gestisce l'accumulazione degli elementi evitando duplicati
- ✅ **Controllo del caricamento** - Verifica automaticamente se ci sono più pagine
- ✅ **Componente UI incluso** - `PaginatedSelectLoadMore` per il pulsante "Carica altro"
- ✅ **TypeScript** - Completamente tipizzato

## Utilizzo Base

### 1. Categorie

```tsx
import { useState } from 'react';
import { useGetCategories } from 'src/hooks/useGetCategorie';
import { usePaginatedSelect } from 'src/hooks/usePaginatedSelect';
import { PaginatedSelectLoadMore } from 'src/components/PaginatedSelectLoadMore';
import { Categoria } from 'src/types/Categoria';

function ProductForm() {
  // 1. Gestisci lo stato della pagina corrente
  const [categoriesPage, setCategoriesPage] = useState(1);

  // 2. Chiama l'API con la pagina corrente
  const { data: categoriesData, isFetching: isFetchingCategories } = useGetCategories(
    categoriesPage,
    25,
    ''
  );

  // 3. Usa l'hook per accumulare i risultati
  const {
    allItems: allCategorie,
    hasMore: hasMoreCategories,
    loadMore: loadMoreCategories,
  } = usePaginatedSelect<Categoria>(categoriesData, isFetchingCategories, () =>
    setCategoriesPage((prev) => prev + 1)
  );

  return (
    <Select multiple>
      {allCategorie.map((categoria) => (
        <MenuItem key={categoria.id} value={categoria.id}>
          {categoria.name}
        </MenuItem>
      ))}

      <PaginatedSelectLoadMore
        hasMore={hasMoreCategories}
        isLoading={isFetchingCategories}
        onLoadMore={loadMoreCategories}
        loadMoreText="Carica altre categorie"
      />
    </Select>
  );
}
```

### 2. Tags

**Opzione A: Componente Riutilizzabile (Consigliato)**

```tsx
// File: prodotto-tags-select.tsx
import { useState } from 'react';
import { useGetTags } from 'src/hooks/useGetTags';
import { usePaginatedSelect } from 'src/hooks/usePaginatedSelect';
import { ProdottoTagsSelect } from './prodotto-tags-select';

function ProductForm() {
  return <ProdottoTagsSelect value={watch('tags')} onChange={(tags) => setValue('tags', tags)} />;
}
```

**Opzione B: Implementazione Diretta**

```tsx
import { useState } from 'react';
import { useGetTags } from 'src/hooks/useGetTags';
import { usePaginatedSelect } from 'src/hooks/usePaginatedSelect';
import { PaginatedSelectLoadMore } from 'src/components/PaginatedSelectLoadMore';
import { Tag } from 'src/types/Tag';

function TagsSelect() {
  const [tagsPage, setTagsPage] = useState(1);
  const { data: tagsData, isFetching } = useGetTags(tagsPage, 25, '');

  const {
    allItems: allTags,
    hasMore,
    loadMore,
  } = usePaginatedSelect<Tag>(tagsData, isFetching, () => setTagsPage((prev) => prev + 1));

  return (
    <Select multiple>
      {allTags.map((tag) => (
        <MenuItem key={tag.id} value={tag.id}>
          {tag.name}
        </MenuItem>
      ))}

      <PaginatedSelectLoadMore
        hasMore={hasMore}
        isLoading={isFetching}
        onLoadMore={loadMore}
        loadMoreText="Carica altri tag"
      />
    </Select>
  );
}
```

### 3. Brands

```tsx
import { useState } from 'react';
import { useGetBrands } from 'src/hooks/useGetBrand';
import { usePaginatedSelect } from 'src/hooks/usePaginatedSelect';
import { PaginatedSelectLoadMore } from 'src/components/PaginatedSelectLoadMore';
import { Brand } from 'src/types/Brand';

function BrandsSelect() {
  const [brandsPage, setBrandsPage] = useState(1);
  const { data: brandsData, isFetching } = useGetBrands(brandsPage, 25, '');

  const {
    allItems: allBrands,
    hasMore,
    loadMore,
  } = usePaginatedSelect<Brand>(brandsData, isFetching, () => setBrandsPage((prev) => prev + 1));

  return (
    <Select multiple>
      {allBrands.map((brand) => (
        <MenuItem key={brand.id} value={brand.id}>
          {brand.name}
        </MenuItem>
      ))}

      <PaginatedSelectLoadMore
        hasMore={hasMore}
        isLoading={isFetching}
        onLoadMore={loadMore}
        loadMoreText="Carica altri brand"
      />
    </Select>
  );
}
```

## API

### usePaginatedSelect

```tsx
function usePaginatedSelect<T extends { id?: number | string }>(
  data: PaginatedResponse<T> | undefined,
  isFetching: boolean,
  onLoadMore: () => void
): UsePaginatedSelectResult<T>;
```

#### Parametri

- **data**: `PaginatedResponse<T> | undefined`

  - La risposta paginata dall'API
  - Deve contenere: `items`, `currentPage`, `totalPages`

- **isFetching**: `boolean`

  - Flag che indica se è in corso un caricamento
  - Disabilita il pulsante "Carica altro" durante il caricamento

- **onLoadMore**: `() => void`
  - Callback chiamato quando si vuole caricare più elementi
  - Tipicamente incrementa `currentPage`

#### Ritorna

- **allItems**: `T[]`
  - Array con tutti gli elementi accumulati (senza duplicati)
- **hasMore**: `boolean`
  - `true` se ci sono più pagine da caricare
- **loadMore**: `() => void`
  - Funzione per caricare la pagina successiva
  - Chiama internamente `onLoadMore` se non sta caricando e ci sono più pagine
- **reset**: `() => void`
  - Funzione per resettare lo stato (svuota `allItems`)
  - Utile quando cambia il filtro di ricerca

### PaginatedSelectLoadMore

```tsx
function PaginatedSelectLoadMore({
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  loadingText?: string;
}): JSX.Element | null
```

#### Props

- **hasMore**: `boolean` - Se `false`, il componente non viene renderizzato
- **isLoading**: `boolean` - Mostra lo spinner quando `true`
- **onLoadMore**: `() => void` - Callback chiamato al click
- **loadMoreText** (opzionale): `string` - Testo del pulsante (default: "Carica altro")
- **loadingText** (opzionale): `string` - Testo durante il caricamento (default: "Caricamento...")

## Note Tecniche

### Gestione Duplicati

L'hook previene automaticamente i duplicati confrontando gli `id` degli elementi:

```tsx
const existingIds = new Set(prev.map((item) => item.id));
const newItems = data.items.filter((item) => !existingIds.has(item.id));
```

### Requisiti dei Tipi

Il tipo generico `T` deve avere una proprietà `id`:

```tsx
T extends { id?: number | string }
```

### Integrazione con React Query

L'hook funziona perfettamente con `@tanstack/react-query`:

```tsx
const { data, isFetching } = useQuery({
  queryKey: ['items', page],
  queryFn: () => fetchItems(page),
});

const { allItems, hasMore, loadMore } = usePaginatedSelect(data, isFetching, () =>
  setPage((prev) => prev + 1)
);
```

## Best Practices

1. **Gestisci lo stato della pagina separatamente**

   ```tsx
   const [page, setPage] = useState(1);
   ```

2. **Passa una funzione stabile per onLoadMore**

   ```tsx
   () => setPage((prev) => prev + 1);
   ```

3. **Usa il reset quando cambiano i filtri**

   ```tsx
   useEffect(() => {
     if (searchTerm) {
       reset();
       setPage(1);
     }
   }, [searchTerm]);
   ```

4. **Personalizza i testi per ogni contesto**
   ```tsx
   <PaginatedSelectLoadMore
     loadMoreText="Carica altre categorie"
     loadingText="Caricamento categorie..."
   />
   ```

## Migrazione

Se hai codice esistente con paginazione manuale, puoi migrare facilmente:

### Prima

```tsx
const [currentPage, setCurrentPage] = useState(1);
const [allCategorie, setAllCategorie] = useState<Categoria[]>([]);
const { data: categorie, isFetching } = useGetCategories(currentPage, 25, '');

useEffect(() => {
  if (categorie?.items) {
    setAllCategorie((prev) => {
      const existingIds = new Set(prev.map((cat) => cat.id));
      const newCategories = categorie.items.filter((cat) => !existingIds.has(cat.id));
      return [...prev, ...newCategories];
    });
  }
}, [categorie]);

const hasMore = categorie ? currentPage < categorie.totalPages : false;
```

### Dopo

```tsx
const [currentPage, setCurrentPage] = useState(1);
const { data: categorie, isFetching } = useGetCategories(currentPage, 25, '');

const {
  allItems: allCategorie,
  hasMore,
  loadMore,
} = usePaginatedSelect(categorie, isFetching, () => setCurrentPage((prev) => prev + 1));
```

## Componenti Riutilizzabili Disponibili

Il progetto include componenti già pronti per l'uso:

### ProdottoCategoriesSelect

```tsx
<ProdottoCategoriesSelect
  value={watch('categories')}
  onChange={(categories) => setValue('categories', categories)}
/>
```

- ✅ Paginazione automatica
- ✅ Visualizzazione gerarchica (indentazione per categorie figlie)
- ✅ Gestione nomi al posto degli ID
- File: `src/sections/prodotto/prodotto-categories-select.tsx`

### ProdottoTagsSelect

```tsx
<ProdottoTagsSelect value={watch('tags')} onChange={(tags) => setValue('tags', tags)} />
```

- ✅ Paginazione automatica
- ✅ Rendering ottimizzato
- ✅ Gestione nomi al posto degli ID
- File: `src/sections/prodotto/prodotto-tags-select.tsx`

## Esempio Completo

Vedi i seguenti file per esempi completi di implementazione:

- **Form prodotto**: `src/sections/prodotto/prodotto-form.tsx`
- **Categorie select**: `src/sections/prodotto/prodotto-categories-select.tsx`
- **Tags select**: `src/sections/prodotto/prodotto-tags-select.tsx`

Implementazioni con:

- Multiselect paginato
- Gestione dello stato del form
- Integrazione con React Hook Form
- Visualizzazione ottimizzata
