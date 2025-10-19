import { Box, Button, Typography } from '@mui/material';
import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { UserTableRow } from '../user-table-row';
import { ExampleModal } from 'src/components/example/ExampleModal';

export interface Column {
  id: string;
  label: string;
  align?: 'center' | 'left' | 'right';
}

export function UserView() {
  const columns: Column[] = [
    { id: 'name', label: 'Name' },
    { id: 'company', label: 'Company' },
    { id: 'role', label: 'Role' },
    { id: 'isVerified', label: 'Verified', align: 'center' },
    { id: 'status', label: 'Status' },
    { id: '', label: '' },
  ];

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button>
      </Box>
      {/* <ExampleModal></ExampleModal> */}

      <GenericTable
        data={_users}
        columns={columns}
        renderRow={(row, selected, onSelectRow) => (
          <UserTableRow
            key={row.id}
            row={row}
            selected={selected}
            onSelectRow={onSelectRow}
          />
        )}
      />
    </DashboardContent>
  );
}
