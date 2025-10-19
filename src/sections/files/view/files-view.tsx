import { Box, Button, Typography } from '@mui/material';
import { GenericTable } from 'src/components/generic-table/GenericTable';
import { useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { useGetFiles } from 'src/hooks/useGetFiles';
import { useSnackbar } from 'src/context/SnackbarContext';

import { FileTableRow } from '../file-table-row';
import { FileUploader } from '../file-uploader';
import { File as FileType } from 'src/types/File';
const columns = [
  { id: 'name', label: 'Nome File' },
  { id: 'size', label: 'Dimensione' },
  { id: 'creationTime', label: 'Data Creazione' },
  //{ id: 'lastModified', label: 'Ultima Modifica' },
  { id: 'preview', label: 'Anteprima' },
  { id: 'actions', label: 'Azioni' },
];

export function FilesView() {
  const { data: files = [], isFetching } = useGetFiles() as { data: FileType[], isFetching: boolean };
  const { showMessage } = useSnackbar();
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = () => {
    showMessage({ text: 'File caricato con successo', type: 'success' });
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          Gestione media ({files?.length || 0})
        </Typography>
      </Box>
      <Box mb={2} width={1}>
        <FileUploader onUploadSuccess={handleUploadSuccess} />
      </Box>

      {/* <GenericTable
        isLoading={isFetching || isUploading}
        data={files ? files.map((file) => ({ id: file.id, ...file })) : []}
        columns={columns}
        showCheckbox={false}
        renderRow={(row) => <FileTableRow key={row.id} row={row} />}
        initialOrderBy="creationTime"
        initialOrder="desc"
      /> */}
    </DashboardContent>
  );
}
