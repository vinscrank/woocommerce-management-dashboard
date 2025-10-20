import { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Card,
  CircularProgress,
  Box,
  TableRow,
  TableCell,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { GenericTableHead } from './GenericTableHead';
import { GenericTableToolbar } from './GenericTableToolbar';
import { TableNoData } from './TableNoData';
import { useTable } from './useTable';
import { getComparator } from './utils';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column[];
  filterField?: keyof T;
  showToolbar?: boolean;
  showCheckbox?: boolean;
  showPagination?: boolean;
  renderRow: (row: T, selected: boolean, onSelectRow: () => void) => React.ReactNode;
  isLoading?: boolean;
  noSearch?: boolean;
  initialOrderBy?: string;
  initialOrder?: 'asc' | 'desc';
  onDragEnd?: (oldIndex: number, newIndex: number) => void;
  noOrder?: boolean;
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
  // Props per paginazione server-side
  serverSidePagination?: boolean;
  totalItems?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  // Props per ricerca server-side
  searchQuery?: string;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GenericTable<T extends { id: number | string }>({
  data,
  columns,
  filterField,
  showToolbar = true,
  showCheckbox = true,
  showPagination = true,
  renderRow,
  isLoading = false,
  noSearch = false,
  initialOrderBy = 'id',
  initialOrder = 'desc',
  noOrder = false,
  onSelectAll,
  allSelected,
  // Props paginazione server-side
  serverSidePagination = false,
  totalItems,
  page: externalPage,
  rowsPerPage: externalRowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  // Props ricerca server-side
  searchQuery: externalSearchQuery,
  onSearchChange,
}: GenericTableProps<T>) {
  const table = useTable(initialOrderBy, initialOrder);
  const [filterName, setFilterName] = useState('');

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // Se c'è un handler esterno (server-side), usa quello
      if (onSearchChange) {
        onSearchChange(event);
      } else {
        // Altrimenti usa lo stato locale (client-side)
        setFilterName(event.target.value);
        table.onResetPage();
      }
    },
    [table, onSearchChange]
  );

  // Usa la query di ricerca esterna se disponibile, altrimenti usa quella locale
  const currentSearchQuery = externalSearchQuery !== undefined ? externalSearchQuery : filterName;

  // Se paginazione server-side, usa i dati così come arrivano (il filtro è già applicato dal server)
  let dataFiltered = serverSidePagination
    ? data
    : currentSearchQuery
      ? data.filter((row) => {
          return Object.values(row).some((value) => {
            if (value === null || value === undefined) return false;

            if (typeof value === 'object') {
              return Object.values(value).some((nestedValue) =>
                String(nestedValue).toLowerCase().includes(currentSearchQuery.toLowerCase())
              );
            }

            return String(value).toLowerCase().includes(currentSearchQuery.toLowerCase());
          });
        })
      : data;

  // Applica l'ordinamento solo se non è server-side e noOrder è false
  dataFiltered =
    serverSidePagination || noOrder
      ? dataFiltered
      : [...dataFiltered].sort(getComparator(table.order, table.orderBy as keyof T));

  // Controlla se la pagina corrente è valida dopo il filtraggio (solo per paginazione client-side)
  if (!serverSidePagination) {
    const pageCount = Math.ceil(dataFiltered.length / table.rowsPerPage);
    if (pageCount > 0 && table.page >= pageCount) {
      table.onResetPage();
    }
  }

  const notFound = !dataFiltered.length && !!currentSearchQuery;
  const fontSize = '0.775rem';

  // Usa i valori esterni se paginazione server-side, altrimenti usa quelli interni
  const currentPage = serverSidePagination ? (externalPage ?? 0) : table.page;
  const currentRowsPerPage = serverSidePagination ? (externalRowsPerPage ?? 10) : table.rowsPerPage;
  const currentCount = serverSidePagination ? (totalItems ?? 0) : dataFiltered.length;

  return (
    <Card>
      {showToolbar && !noSearch && (
        <GenericTableToolbar
          numSelected={table.selected.length}
          filterName={currentSearchQuery}
          onFilterName={handleFilterName}
        />
      )}

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table
              sx={{
                minWidth: 200,
                '& .MuiTableCell-root': {
                  fontSize: fontSize,
                },
                '& .MuiTableCell-root .MuiInputBase-input': {
                  fontSize: fontSize,
                },
                '& .MuiTableCell-root .MuiTypography-root': {
                  fontSize: fontSize,
                },
              }}
              size="small"
            >
              <GenericTableHead
                noOrder={noOrder}
                order={table.order}
                orderBy={table.orderBy}
                rowCount={data.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                headLabel={columns}
                onSelectAllRows={onSelectAll}
                allSelected={allSelected}
              />
              <SortableContext
                items={dataFiltered.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {dataFiltered.length === 0 && !currentSearchQuery ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        sx={{
                          textAlign: 'center',
                          py: 3,
                          typography: 'body1',
                        }}
                      >
                        Nessun dato disponibile
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Se server-side, non fare slice (i dati sono già paginati dal server)
                    (serverSidePagination
                      ? dataFiltered
                      : dataFiltered.slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                    ).map((row) =>
                      renderRow(row, table.selected.includes(row.id.toString()), () =>
                        table.onSelectRow(row.id.toString())
                      )
                    )
                  )}

                  {notFound && <TableNoData searchQuery={currentSearchQuery} />}
                </TableBody>
              </SortableContext>
            </Table>
          </TableContainer>
        </Scrollbar>
      )}

      {showPagination && (
        <TablePagination
          component="div"
          page={currentPage}
          count={currentCount}
          rowsPerPage={currentRowsPerPage}
          onPageChange={
            serverSidePagination && onPageChange
              ? (_event, newPage) => onPageChange(newPage)
              : table.onChangePage
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
          onRowsPerPageChange={
            serverSidePagination && onRowsPerPageChange
              ? (event) => onRowsPerPageChange(parseInt(event.target.value, 10))
              : table.onChangeRowsPerPage
          }
          labelRowsPerPage="Righe per pagina:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} di ${count}`}
        />
      )}
    </Card>
  );
}
