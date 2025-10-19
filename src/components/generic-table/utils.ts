type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator<T>(order: Order, orderBy: keyof T) {
    return order === 'desc'
        ? (a: T, b: T) => descendingComparator(a, b, orderBy)
        : (a: T, b: T) => -descendingComparator(a, b, orderBy);
}

interface ApplyFilterProps<T> {
    inputData: T[];
    comparator: (a: T, b: T) => number;
    filterName: string;
    filterField: keyof T;
}

export function applyFilter<T>({
    inputData,
    comparator,
    filterName,
    filterField,
}: ApplyFilterProps<T>) {
    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    if (filterName) {
        return inputData.filter(
            (item) =>
                String(item[filterField])
                    .toLowerCase()
                    .indexOf(filterName.toLowerCase()) !== -1
        );
    }

    return stabilizedThis.map((el) => el[0]);
} 