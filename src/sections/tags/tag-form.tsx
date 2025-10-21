import { Grid, TextField, Chip, Typography, Button, Box } from '@mui/material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Tag } from 'src/types/Tag';
import { usePostTag } from 'src/hooks/usePostTag';
import React from 'react';
import { useForm } from 'react-hook-form';
import { usePutTag } from 'src/hooks/usePutTag';
import { InfoLabel } from 'src/components/InfoLabel';

interface TagFormProps {
    tag: Tag
    onSubmit: (data: any) => void
}

export function TagForm({ tag, onSubmit }: TagFormProps) {
    const postTag = usePostTag();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            name: tag?.name || '',
        }
    });
    const { mutate: createTag, isPending: isPosting } = usePostTag();
    const { mutate: updateTag, isPending: isUpdating } = usePutTag();


    const onSubmitForm = async (data: any) => {

        if (tag) {
            updateTag({
                ...tag,
                ...data
            }, {
                onSuccess: () => onSubmit(data),
                onError: (error) => {
                    console.error('Errore durante il salvataggio del tag:', error);
                }
            });
        } else {
            createTag(data, {
                onSuccess: () => onSubmit(data),
                onError: (error) => {
                    console.error('Errore durante il salvataggio del tag:', error);
                }
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid container spacing={2}  >
               


                {tag?.id && (
                    <>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="ID"
                                value={tag.id}
                                disabled
                            />
                        </Grid>
                        
                    </>
                )}

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Nome"
                        {...register('name', { required: true })}
                        error={!!errors.name}
                        helperText={errors.name && "Il nome è obbligatorio"}
                        required

                    />
                </Grid>

                {/* {tag?.id && (
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Slug"

                            {...register('slug', { required: true })}
                        />
                    </Grid>
                )} */}



                <Grid item xs={12}>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isPosting || isUpdating}
                    >
                        {isPosting || isUpdating ? 'Salvataggio...' : 'Salva Tag'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
} 