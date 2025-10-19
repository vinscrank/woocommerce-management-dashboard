import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { CircularProgress, IconButton, MenuItem, menuItemClasses, MenuList, Popover } from '@mui/material';
import { Label } from 'src/components/label';
import { Tag } from 'src/types/Tag';
import { useCallback, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { useDeleteTag } from 'src/hooks/useDeleteTag';

type TagTableRowProps = {
    row: Tag;
    selected: boolean;
    onEdit: (tag: Tag) => void;
};

export function TagTableRow({
    row,
    selected,
    onEdit,
}: TagTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const { mutate: deleteTag, isPending: isDeleting } = useDeleteTag();

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleDelete = () => {
        if (confirm('Sei sicuro di voler eliminare questo tag?')) {
            deleteTag(row.id as number);
        }
    };

    const handleEdit = () => {
        handleClosePopover();
        onEdit(row);
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell>{row.id}</TableCell>
            
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.slug}</TableCell>
           
              
                <TableCell >
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
                            [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                        },
                    }}
                >
                    <MenuItem onClick={handleEdit}>
                        <Iconify icon="solar:pen-bold" />
                        Modifica
                    </MenuItem>

                    <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                        {isDeleting ? (
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