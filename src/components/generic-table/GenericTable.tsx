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
}: GenericTableProps<T>) {
    const table = useTable(initialOrderBy, initialOrder);
    const [filterName, setFilterName] = useState('');

    const handleFilterName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
        table.onResetPage();
    }, [table]);

    let dataFiltered = filterName
        ? data.filter((row) => {
            return Object.values(row).some((value) => {
                if (value === null || value === undefined) return false;

                if (typeof value === 'object') {
                    return Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(filterName.toLowerCase())
                    );
                }

                return String(value).toLowerCase().includes(filterName.toLowerCase());
            });
        })
        : data;

    // Applica l'ordinamento dopo il filtro solo se noOrder è false
    dataFiltered = noOrder
        ? dataFiltered
        : [...dataFiltered].sort(getComparator(table.order, table.orderBy as keyof T));

    // Controlla se la pagina corrente è valida dopo il filtraggio
    const pageCount = Math.ceil(dataFiltered.length / table.rowsPerPage);
    if (pageCount > 0 && table.page >= pageCount) {
        table.onResetPage();
    }

    const notFound = !dataFiltered.length && !!filterName;
    const fontSize = '0.775rem';

    return (
      <Card>
        {showToolbar && !noSearch && (
          <GenericTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
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
                    {dataFiltered.length === 0 && !filterName ? (
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
                      dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) =>
                          renderRow(row, table.selected.includes(row.id.toString()), () =>
                            table.onSelectRow(row.id.toString())
                          )
                        )
                    )}

                    {notFound && <TableNoData searchQuery={filterName} />}
                  </TableBody>
                </SortableContext>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}

        {showPagination && (
          <TablePagination
            component="div"
            page={table.page}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        )}
      </Card>
    );
} 