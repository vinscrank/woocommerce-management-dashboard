import { Box, IconButton } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { useDevUrl } from 'src/hooks/useDevUrl';

interface SortableImageProps {
  immagine: any;
  index: number;
  onDelete: (immagine: any) => void;
}

export const SortableImage = ({ immagine, index, onDelete }: SortableImageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { convertUrl } = useDevUrl();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: immagine.src,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <Box position="relative" display="inline-block">
        {/* Area per il drag and drop */}
        <Box {...attributes} {...listeners} position="absolute" top={0} right={0} p={1}>
          <Iconify icon="eva:move-fill" sx={{ cursor: 'grab' }} />
        </Box>
        {/* Immagine cliccabile */}
        <img
          src={`${convertUrl(immagine.src)}`}
          alt={`Img ${index}`}
          style={{
            objectFit: 'cover',
            width: '100px',
            height: '100px',
            cursor: 'pointer',
          }}
          className="img-generica"
          onClick={handleImageClick}
        />
        {/* Pulsante elimina */}
        <IconButton
          color="error"
          size="small"
          style={{ position: 'absolute', bottom: '10px', left: '10px' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Sei sicuro di voler eliminare questa immagine?')) {
              onDelete(immagine);
            }
          }}
        >
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
      </Box>

      {/* Modale per visualizzare l'immagine */}
      <GenericModal
        title={`Immagine ${index + 1}`}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}
        >
          <img
            src={`${convertUrl(immagine.src)}`}
            alt={`Img ${index}`}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        </Box>
      </GenericModal>
    </Box>
  );
};
