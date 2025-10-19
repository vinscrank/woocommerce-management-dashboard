import { TableRow, TableCell } from '@mui/material';

interface TableEmptyRowsProps {
    height: number;
    emptyRows: number;
}

export function TableEmptyRows({ emptyRows, height }: TableEmptyRowsProps) {
    if (!emptyRows) {
        return null;
    }

    return (
        <TableRow
            sx={{
                height: height * emptyRows,
            }}
        >
            <TableCell colSpan={9} />
        </TableRow>
    );
} 