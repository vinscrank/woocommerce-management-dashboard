import { useState, useCallback } from 'react';

export function useTable(initialOrderBy = 'id', initialOrder: 'asc' | 'desc' = 'desc') {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState(initialOrderBy);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [selected, setSelected] = useState<string[]>([]);
    const [order, setOrder] = useState<'asc' | 'desc'>(initialOrder);

    const onSort = useCallback(
        (initialOrderBy: string | undefined) => {
            if (!initialOrderBy) return;
            const isAsc = orderBy === initialOrderBy && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(initialOrderBy);
        },
        [order, orderBy]
    );

    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        setSelected(checked ? newSelecteds : []);
    }, []);

    const onSelectRow = useCallback(
        (inputValue: string) => {
            const newSelected = selected.includes(inputValue)
                ? selected.filter((value) => value !== inputValue)
                : [...selected, inputValue];
            setSelected(newSelected);
        },
        [selected]
    );

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            onResetPage();
        },
        [onResetPage]
    );

    const getEmptyRows = useCallback(
        (totalItems: number) => {
            if (page === 0) return 0;

            const remainingItems = totalItems - (page * rowsPerPage);
            if (remainingItems <= 0) return 0;

            return Math.max(0, rowsPerPage - remainingItems);
        },
        [page, rowsPerPage]
    );

    return {
        page,
        order,
        orderBy,
        selected,
        rowsPerPage,
        onSort,
        onSelectRow,
        onResetPage,
        onChangePage,
        onSelectAllRows,
        onChangeRowsPerPage,
        getEmptyRows,
    };
} 