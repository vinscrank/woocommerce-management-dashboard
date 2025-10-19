import { forwardRef, useState, useCallback, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {
  IconButton,
  TextField,
  Switch,
  Chip,
  InputAdornment,
  Box,
  Popover,
  MenuItem,
  menuItemClasses,
  MenuList,
  CircularProgress,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { NumericFormat } from 'react-number-format';
import { InfoLabel } from 'src/components/InfoLabel';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { STOCK_ENABLED } from 'src/utils/const';
import { useForm, Controller } from 'react-hook-form';

type ProdottoVariazioneTableRowProps = {
  row: any;
  onEdit: () => void;
  onDelete: () => void;
  id: number;
  isLoading?: boolean;
  onUpdate?: (updates: Partial<any>) => void;
  onDragEnd?: (oldIndex: number, newIndex: number) => void;
};

export const ProdottoVariazioneTableRow = forwardRef<
  HTMLTableRowElement,
  ProdottoVariazioneTableRowProps
>(({ row, onEdit, onDelete, id, isLoading = false, onUpdate }, ref) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: row,
  });

  useEffect(() => {
    reset(row);
  }, [row, reset]);

  const onSubmit = (data: any) => {
    onUpdate?.(data);
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
    data: {
      type: 'row',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  console.log('Row', row);

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <IconButton
          size="small"
          {...attributes}
          {...listeners}
          data-handle={true}
          sx={{
            cursor: 'move',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <Iconify icon="eva:move-fill" />
        </IconButton>
      </TableCell>

      <TableCell>{row.id}</TableCell>
      <TableCell>
        {row.attributes
          .map((attribute: any) => attribute.name + ': ' + attribute.option)
          .join(', ')}
      </TableCell>
      <TableCell>
        <Controller
          name="sku"
          control={control}
          render={({ field })        => (
            <TextField {...field} size="small" onBlur={() => handleSubmit(onSubmit)()} />
          )}
        />
      </TableCell>

      {STOCK_ENABLED === '1' && (
        <TableCell>
          <Controller
            name="stockQuantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                type="number"
                disabled={!row.manage_stock}
                onBlur={() => handleSubmit(onSubmit)()}
              />
            )}
          />
        </TableCell>
      )}

      <TableCell>
        <Controller
          name="regularPrice"
          control={control}
          render={({ field }) => (
            <NumericFormat
              customInput={TextField}
              {...field}
              size="small"
              decimalScale={2}
              fixedDecimalScale
              onBlur={() => handleSubmit(onSubmit)()}
              thousandSeparator="."
              decimalSeparator=","
              valueIsNumericString={true}
              onValueChange={(values) => {
                field.onChange(values.floatValue);
              }}
            />
          )}
        />
      </TableCell>

      <TableCell>
        <Controller
          name="salePrice"
          control={control}
          render={({ field }) => (
            <NumericFormat
              customInput={TextField}
              {...field}
              size="small"
              decimalScale={2}
              fixedDecimalScale
              onBlur={() => handleSubmit(onSubmit)()}
              thousandSeparator="."
              decimalSeparator=","
              valueIsNumericString={true}
              onValueChange={(values) => {
                field.onChange(values.floatValue);
              }}
            />
          )}
        />
      </TableCell>

      <TableCell>
        <InfoLabel
          title={row.onSale ? 'SI' : 'NO'}
          color={row.onSale ? 'info' : 'warning'}
          sx={{
            p: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 30,
          }}
        />
      </TableCell>

      <TableCell>
        <Switch checked={row.purchasable} disabled size="small" />
      </TableCell>

      <TableCell>
        <IconButton onClick={handleOpenPopover}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>

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
          <MenuItem
            onClick={() => {
              onEdit();
              handleClosePopover();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Modifica
          </MenuItem>
          <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
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
    </TableRow>
  );
});
