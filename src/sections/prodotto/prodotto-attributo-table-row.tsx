import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { CircularProgress, IconButton, MenuItem, menuItemClasses, MenuList, Popover, Chip, Tooltip } from '@mui/material';
import { useState, useCallback } from 'react';
import { Iconify } from 'src/components/iconify';

type ProdottoAttributoTableRowProps = {
    row: any;
    selected: boolean;
    onEdit: (attributo: any) => void;
    onDelete: (attributo: any) => void;
    isLoading: boolean;
};

export function ProdottoAttributoTableRow({
    row,
    selected,
    onEdit,
    onDelete,
    isLoading
}: ProdottoAttributoTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleEdit = () => {
        handleClosePopover();
        onEdit(row);
    };

    const handleDelete = () => {
        onDelete(row);
    };


    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected} >
                <TableCell>

                    {row.attributo?.is_specifico ? (
                        <Tooltip title="Attributo Interno" arrow>
                            <Iconify
                                icon="eva:info-fill"
                                sx={{
                                    verticalAlign: 'middle',
                                    mr: 1,
                                    width: 16,
                                    height: 16,
                                    color: 'info.main',
                                }}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Attributo Standard" arrow>
                            <Iconify
                                icon="eva:checkmark-circle-2-fill"
                                sx={{
                                    mr: 1,
                                    width: 16,
                                    height: 16,
                                    color: 'success.main',
                                }}
                            />
                        </Tooltip>
                    )}
                   
                
                    {row.id || '-'}
                    {row.name || '-'}
                </TableCell>
                
                {/* <TableCell>
                    {row.abilitato_per_variazioni ? 'SI' : 'NO'}
                </TableCell>
                <TableCell>
                    {row.visibile ? 'SI' : 'NO'}
                </TableCell>
                <TableCell>
                    {row.opzioni_id?.map((opzione: string) => (
                        <Chip
                            key={opzione}
                            label={opzione}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                        />
                    ))}
                </TableCell> */}
                <TableCell>

                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                        },
                    }}
                >
                    <MenuItem onClick={handleEdit} >
                        <Iconify icon="solar:pen-bold" />
                        Modifica
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                        {isLoading ? (
                            <CircularProgress size={20} />
                        ) : (
                            <>
                                <Iconify icon="solar:trash-bin-trash-bold" />
                                Elimina
                            </>
                        )}
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
} 