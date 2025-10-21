import { Box, TableRow, TableCell, TableHead, Checkbox, TableSortLabel } from '@mui/material';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  noOrder?: boolean;
}

interface GenericTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
  numSelected: number;
  onSort: (id: string) => void;
  onSelectAllRows?: (checked: boolean) => void;
  allSelected?: boolean;
  headLabel: Column[];
  noOrder?: boolean;
}

export function GenericTableHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  onSort,
  onSelectAllRows,
  allSelected,
  headLabel,
  noOrder,
}: GenericTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {onSelectAllRows && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={allSelected || false}
              onChange={(event) => onSelectAllRows(event.target.checked)}
            />
          </TableCell>
        )}

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {noOrder || headCell.noOrder ? (
              headCell.label
            ) : (
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => onSort(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
