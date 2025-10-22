import { Box, Button, CircularProgress } from '@mui/material';
import { Iconify } from './iconify';

interface PaginatedSelectLoadMoreProps {
  /**
   * Se true, mostra il pulsante
   */
  hasMore: boolean;

  /**
   * Se true, mostra lo stato di caricamento
   */
  isLoading: boolean;

  /**
   * Callback chiamato quando si clicca sul pulsante
   */
  onLoadMore: () => void;

  /**
   * Testo del pulsante quando non sta caricando
   * @default 'Carica altro'
   */
  loadMoreText?: string;

  /**
   * Testo del pulsante quando sta caricando
   * @default 'Caricamento...'
   */
  loadingText?: string;
}

/**
 * Componente riutilizzabile per il pulsante "Carica altro" nelle select paginate
 *
 * @example
 * ```tsx
 * <Select>
 *   {items.map(item => <MenuItem key={item.id}>{item.name}</MenuItem>)}
 *
 *   <PaginatedSelectLoadMore
 *     hasMore={hasMore}
 *     isLoading={isLoading}
 *     onLoadMore={loadMore}
 *   />
 * </Select>
 * ```
 */
export function PaginatedSelectLoadMore({
  hasMore,
  isLoading,
  onLoadMore,
  loadMoreText = 'Carica altro',
  loadingText = 'Caricamento...',
}: PaginatedSelectLoadMoreProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
      <Button
        size="small"
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation();
          onLoadMore();
        }}
        disabled={isLoading}
        startIcon={
          isLoading ? <CircularProgress size={16} /> : <Iconify icon="eva:arrow-down-fill" />
        }
      >
        {isLoading ? loadingText : loadMoreText}
      </Button>
    </Box>
  );
}
