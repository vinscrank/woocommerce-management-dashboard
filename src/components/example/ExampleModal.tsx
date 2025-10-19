import { useState } from 'react';
import { TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { GenericModal } from '../generic-modal/GenericModal';

export const ExampleModal = () => {
    const [open, setOpen] = useState(false);
    const { control, handleSubmit } = useForm();

    const handleConfirm = async (data: any) => {
        // Simula una chiamata al server
        await new Promise(resolve => setTimeout(resolve, 2000));
      
    };

    return (
        <>
            <button onClick={() => setOpen(true)}>Apri Modale</button>

            <GenericModal
                open={open}
                onClose={() => setOpen(false)}
                title="Esempio Modale"
                description="Questa è una modale di esempio con un form"
                confirmButtonText="Salva"
                cancelButtonText="Chiudi"
                onConfirm={handleSubmit(handleConfirm)}
            >
                <form>
                    <Controller
                        control={control}
                        name="nome"
                        defaultValue=""
                        rules={{ required: 'Campo obbligatorio' }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                label="Nome"
                                fullWidth
                                margin="normal"
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        defaultValue=""
                        rules={{
                            required: 'Campo obbligatorio',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email non valida'
                            }
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                label="Email"
                                fullWidth
                                margin="normal"
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </form>
            </GenericModal>
        </>
    );
}; 