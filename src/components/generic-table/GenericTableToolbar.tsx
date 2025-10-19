import {
    Toolbar,
    OutlinedInput,
    InputAdornment,
    Stack,
    Typography,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

interface GenericTableToolbarProps {
    numSelected: number;
    filterName: string;
    onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GenericTableToolbar({
    numSelected,
    filterName,
    onFilterName,
}: GenericTableToolbarProps) {
    return (
        <Toolbar
            sx={{
                height: 96,
                display: 'flex',
                justifyContent: 'space-between',
                padding: (theme) => theme.spacing(0, 1, 0, 3),
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : (
                <Stack direction="row" spacing={2}>
                    <OutlinedInput
                        size="small"
                        value={filterName}
                        onChange={onFilterName}
                        placeholder="Cerca..."
                        startAdornment={
                            <InputAdornment position="start">
                                <Iconify
                                    icon="eva:search-fill"
                                    sx={{ color: 'text.disabled', width: 20, height: 20 }}
                                />
                            </InputAdornment>
                        }
                    />
                </Stack>
            )}
        </Toolbar>
    );
} 