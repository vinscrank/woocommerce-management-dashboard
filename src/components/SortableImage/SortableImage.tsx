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
        {/* Area per il drag and drop - MIGLIORATA */}
        <Box
          {...attributes}
          {...listeners}
          position="absolute"
          top={4}
          right={4}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <Iconify
            icon="eva:move-fill"
            sx={{
              color: 'white',
              fontSize: 20,
            }}
          />
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
            borderRadius: '4px',
          }}
          className="img-generica"
          onClick={handleImageClick}
        />
        {/* Pulsante elimina - MIGLIORATO */}
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            bottom: 4,
            left: 4,
            backgroundColor: 'rgba(211, 47, 47, 0.9)',
            color: 'white',
            width: 32,
            height: 32,
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 1)',
              transform: 'scale(1.1)',
            },
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Sei sicuro di voler eliminare questa immagine?')) {
              onDelete(immagine);
            }
          }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ fontSize: 18 }} />
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
