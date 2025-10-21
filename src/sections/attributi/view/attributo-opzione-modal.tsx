import { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { AttributoOpzioneForm } from './attributo-opzione-form';
import { AttributoOpzione } from 'src/types/AttributoOpzione';
import { Label } from 'src/components/label';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
import { InfoLabel } from 'src/components/InfoLabel';

interface AttributoOpzioneModalProps {
    open: boolean;
    onClose: () => void;
    opzione?: AttributoOpzione;
    attributoId: number;
    onSubmitSuccess: () => void;
}

export function AttributoOpzioneModal({
    open,
    onClose,
    opzione,
    attributoId,
    onSubmitSuccess
}: AttributoOpzioneModalProps) {
    const [currentOpzione, setCurrentOpzione] = useState<AttributoOpzione | undefined>(opzione);

    useEffect(() => {
        setCurrentOpzione(opzione);
    }, [opzione]);

    const handleSubmitSuccess = () => {
        onSubmitSuccess();
        onClose();
    };

    const handleConfirm = async () => {
        // Questa funzione non verrà utilizzata poiché il form ha la sua logica di submit
        // Il pulsante di conferma è nascosto nel GenericModal
    };

    const title = currentOpzione?.id ? `Opzione: ${currentOpzione.name}` : 'Nuova Opzione';

    return (
        <GenericModal
            open={open}
            onClose={onClose}
            title={title}
            onConfirm={handleConfirm}
            maxWidth="xs"
        >
           

            <AttributoOpzioneForm
                opzione={currentOpzione}
                attributoId={attributoId}
                onSubmit={handleSubmitSuccess}
            />
        </GenericModal>
    );
} 