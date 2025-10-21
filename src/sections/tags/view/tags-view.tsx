import { Box, Button, Typography } from '@mui/material';
import { GenericTable } from 'src/components/generic-table/GenericTable';

import { useState } from 'react';

import { Column } from '../../user/view/user-view';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { TagTableRow } from '../tag-table-row';
import { useGetTags } from 'src/hooks/useGetTags';
import { useDeleteTag } from 'src/hooks/useDeleteTag';
import { Iconify } from 'src/components/iconify';
import { TagForm } from '../tag-form';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { Tag } from 'src/types/Tag';
import { useSnackbar } from 'src/context/SnackbarContext';
import { useExportTags } from 'src/hooks/useExportTags';
import { usePaginatedTable } from 'src/hooks/usePaginatedTable';

const columns: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Nome' },
  { id: 'slug', label: 'Slug' },
  { id: 'actions', label: 'Azioni' },
];

export function TagsView() {
  // Hook per paginazione e ricerca
  const {
    page,
    rowsPerPage,
    searchQuery,
    debouncedSearchQuery,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
  } = usePaginatedTable({
    initialPage: 0,
    initialRowsPerPage: 25,
  });

  const { data, isFetching, isRefetching } = useGetTags(
    page + 1,
    rowsPerPage,
    debouncedSearchQuery
  );
  const tags = data?.items || [];
  const totalItems = data?.totalItems || 0;

  const { isPending: isDeleting } = useDeleteTag();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const { mutate: exportTags, isPending: isExporting } = useExportTags();
  const { showMessage } = useSnackbar();

  const handleOpenModal = (tag?: Tag) => {
    setSelectedTag(tag || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTag(null);
  };

  const handleSubmit = async (data: any) => {
    handleCloseModal();
  };

  const handleExportTags = () => {
    exportTags(undefined, {
      onSuccess: () => {
        showMessage({ text: 'Tags esportati con successo', type: 'success' });
      },
    });
  };
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          Lista Tags ({totalItems})
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenModal()}
          >
            Nuovo tag
          </Button>
        </Box>
      </Box>

      <GenericModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedTag ? `Tag: ${selectedTag.name}` : 'Nuovo Tag'}
        onConfirm={handleSubmit}
        maxWidth="xs"
      >
        <TagForm tag={selectedTag as Tag} onSubmit={handleSubmit} />
      </GenericModal>

      <GenericTable
        isLoading={isFetching || isRefetching || isDeleting || isExporting}
        data={(tags || []) as Array<Tag & { id: number }>}
        columns={columns}
        showCheckbox={false}
        noOrder={true}
        serverSidePagination
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        renderRow={(row, selected) => (
          <TagTableRow key={row.id} row={row as any} selected={selected} onEdit={handleOpenModal} />
        )}
      />
    </DashboardContent>
  );
}
