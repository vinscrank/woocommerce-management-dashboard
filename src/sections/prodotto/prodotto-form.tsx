import { useForm } from 'react-hook-form';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Switch,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';

import { useState, useEffect } from 'react';
import { Prodotto } from 'src/types/Prodotto';
import { Iconify } from 'src/components/iconify';
import { formatDateTime } from 'src/hooks/use-format-date';
import { useAccordionStyles } from 'src/hooks/useAccordionStyles';
import { ProdottoCategoriesSelect } from './prodotto-categories-select';
import { ProdottoTagsSelect } from './prodotto-tags-select';
import { ProdottoBrandsSelect } from './prodotto-brands-select';
import { ProdottoDescriptionEditor } from './prodotto-description-editor';
import { useCleanEmptyFields } from 'src/hooks/useCleanEmptyFields';
import { usePostProdotto } from 'src/hooks/usePostProdotto';
import { usePutProdotto } from 'src/hooks/usePutProdotto';
import { useDeleteProdotto } from 'src/hooks/useDeleteProdotto';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ProdottoAttributiDatatable } from './prodotto-attributi-table';
import { ProdottoVariazioniDatatable } from './prodotto-variazioni-datatable';
import { STOCK_ENABLED } from 'src/utils/const';
import { removeReadOnlyFields } from 'src/utils/prodotto-utils';
import { NumericFormat } from 'react-number-format';
import { useGetProdotto } from 'src/hooks/useGetProdotto';
import { Media } from 'src/types/File';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableImage } from 'src/components/SortableImage/SortableImage';
import { useExportProdotti } from 'src/hooks/useExportProdotti';
import { useGetFiles } from 'src/hooks/useGetFiles';
import { UploadModal } from 'src/components/upload-modal/UploadModal';
import { useDevUrl } from 'src/hooks/useDevUrl';
import { useProdottoStatus } from 'src/hooks/useProdottoStatus';
import { useGetStockStati } from 'src/hooks/useGetStockStati';
import { ProdottoStatusLabel, CatalogVisibilityLabel } from 'src/types/ProdottoEnums';

type ProdottoFormProps = {
  prodotto: Prodotto | null;
  prodottoId: string;
  onSubmit: (data: any) => void;
  onDelete?: (id: string, force: boolean) => void;
  onSync?: () => void;
  loading?: boolean;
  errors?: string[];
};

export function ProdottoForm({
  prodotto,
  onDelete,
  onSync,
  loading = false,
  errors = [],
}: ProdottoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
    reset,
    watch,
  } = useForm<Prodotto>({
    defaultValues: {
      name: prodotto?.name || '',
      sku: prodotto?.sku || '',
      type: prodotto?.type,
      status: prodotto?.status,
      stockStatus: prodotto?.stockStatus,
      catalogVisibility: prodotto?.catalogVisibility || 'visible',
      onSale: prodotto?.onSale || false,
      slug: prodotto?.slug || '',
      shippingClass: prodotto?.shippingClass || '',
      manageStock: STOCK_ENABLED === '1' ? prodotto?.manageStock || false : false,
      stockQuantity: STOCK_ENABLED === '1' ? prodotto?.stockQuantity || 0 : 0,
      regularPrice: prodotto?.regularPrice || '',
      salePrice: prodotto?.salePrice || '',
      price: prodotto?.price || '',
      dateOnSaleFrom: prodotto?.dateOnSaleFrom
        ? dayjs(prodotto.dateOnSaleFrom).isValid()
          ? dayjs(prodotto.dateOnSaleFrom).format('DD-MM-YYYY')
          : ''
        : '',
      dateOnSaleTo: prodotto?.dateOnSaleTo
        ? dayjs(prodotto.dateOnSaleTo).isValid()
          ? dayjs(prodotto.dateOnSaleTo).format('DD-MM-YYYY')
          : ''
        : '',
      //meta_title: prodotto?.meta_title || '',
      //meta_description: prodotto?.meta_description || '',
      shortDescription: prodotto?.shortDescription || '',
      description: prodotto?.description || '',
      categories: prodotto?.categories || [],
      tags: prodotto?.tags || [],
      brands: prodotto?.brands || [],
      id: prodotto?.id || undefined,
      permalink: prodotto?.permalink || '',
    },
  });

  const formImages = watch('images') || prodotto?.images || [];

  useEffect(() => {
    if (prodotto) {
      reset({
        ...prodotto,
        // Parse la data dal formato ISO o da qualsiasi formato valido
        dateOnSaleFrom: prodotto.dateOnSaleFrom
          ? dayjs(prodotto.dateOnSaleFrom).isValid()
            ? dayjs(prodotto.dateOnSaleFrom).format('DD-MM-YYYY')
            : undefined
          : undefined,
        dateOnSaleTo: prodotto.dateOnSaleTo
          ? dayjs(prodotto.dateOnSaleTo).isValid()
            ? dayjs(prodotto.dateOnSaleTo).format('DD-MM-YYYY')
            : undefined
          : undefined,
        // brands: prodotto.brands || [],
      });
    }
  }, [prodotto, reset, setValue]);

  const navigate = useNavigate();
  const productType = watch('type');
  const manageStock = watch('manageStock');
  const { ProdottoStatus, StockStatus, CatalogVisibility } = useProdottoStatus();

  const prodottoTipi = [
    { name: 'Variabile', value: 'variable' },
    { name: 'Semplice', value: 'simple' },
  ];

  const prodottoStati = [
    { name: ProdottoStatusLabel[ProdottoStatus.PUBLISH], value: ProdottoStatus.PUBLISH },
    { name: ProdottoStatusLabel[ProdottoStatus.PRIVATE], value: ProdottoStatus.PRIVATE },
    { name: ProdottoStatusLabel[ProdottoStatus.DRAFT], value: ProdottoStatus.DRAFT },
    { name: ProdottoStatusLabel[ProdottoStatus.PENDING], value: ProdottoStatus.PENDING },
  ];

  const stockStati = useGetStockStati();

  const catalogVisibilityOptions = [
    { name: CatalogVisibilityLabel[CatalogVisibility.VISIBLE], value: CatalogVisibility.VISIBLE },
    { name: CatalogVisibilityLabel[CatalogVisibility.CATALOG], value: CatalogVisibility.CATALOG },
    { name: CatalogVisibilityLabel[CatalogVisibility.SEARCH], value: CatalogVisibility.SEARCH },
    { name: CatalogVisibilityLabel[CatalogVisibility.HIDDEN], value: CatalogVisibility.HIDDEN },
  ];

  const { mutate: storeProdotto, isPending: isStoreLoading } = usePostProdotto();
  const { mutate: updateProdotto, isPending: isUpdateLoading } = usePutProdotto(
    prodotto?.id as number
  );
  const { mutate: deleteProdotto, isPending: isDeleteLoading } = useDeleteProdotto(
    prodotto?.id as number
  );

  // Gestione upload immagini
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [selectedExistingFiles, setSelectedExistingFiles] = useState<Media[]>([]);

  // Aggiungi questi stati per gestire i valori dell'editor
  const [shortDescription, setShortDescription] = useState(prodotto?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(prodotto?.description || '');

  // Stato per gestire i metaData
  // WooCommerce usa 'name' ma noi mappiamo a 'key' per consistenza
  // const [metaData, setMetaData] = useState<
  //   Array<{ id?: number; key?: string; name?: string; value?: string }>
  // >(
  //   prodotto?.metaData?.map((meta) => {
  //     const metaAny = meta as any;
  //     return {
  //       ...meta,
  //       key: metaAny.key || metaAny.name,
  //       name: metaAny.name || metaAny.key,
  //     };
  //   }) || []
  // );

  // Stato per gestire l'apertura/chiusura della modal upload
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Aggiorna i valori del form quando cambiano gli editor
  useEffect(() => {
    setValue('shortDescription', shortDescription as any);
  }, [shortDescription, setValue]);

  useEffect(() => {
    setValue('description', fullDescription as any);
  }, [fullDescription, setValue]);

  // Aggiorna metaData quando cambia il prodotto
  // useEffect(() => {
  //   if (prodotto?.metaData) {
  //     setMetaData(
  //       prodotto.metaData.map((meta) => {
  //         const metaAny = meta as any;
  //         return {
  //           ...meta,
  //           key: metaAny.key || metaAny.name,
  //           name: metaAny.name || metaAny.key,
  //         };
  //       })
  //     );
  //   }
  // }, [prodotto?.metaData]);

  // Configurazione dei moduli per l'editor Quill
  // const quillModules = {
  //   toolbar: [
  //     [{ header: [1, 2, 3, false] }],
  //     ['bold', 'italic', 'underline', 'strike'],
  //     [{ list: 'ordered' }, { list: 'bullet' }],
  //     [{ color: [] }, { background: [] }],
  //     ['link', 'image'],
  //     ['clean'],
  //   ],
  // };

  const handleDelete = (id: string, force: boolean) => {
    deleteProdotto({ force });
    if (onDelete) onDelete(id, force);
  };

  // Hook per gli stili degli accordion
  const getAccordionStyles = useAccordionStyles();

  // Hook per pulire i campi vuoti
  const cleanEmptyFields = useCleanEmptyFields();

  //Funzione per rimuovere un'immagine
  const handleProdottoImmagineRimuovi = async (immagine: any) => {
    // Rimuovi l'immagine dall'array images del prodotto
    const currentImages = prodotto?.images || [];
    const updatedImages = currentImages.filter((img) => img.id !== immagine.id);

    // Aggiorna il campo images nel form
    setValue('images', updatedImages as any);

    // Salva automaticamente il prodotto per aggiornare le immagini
    if (prodotto?.id) {
      const formData = watch(); // Ottieni tutti i dati del form

      // Assicurati che le immagini aggiornate siano nel formData
      formData.images = updatedImages;

      // Pulisci i campi vuoti prima di inviare (risolve errore dimensions)
      const cleanedFormData = cleanEmptyFields(formData);

      updateProdotto(
        { id: prodotto.id.toString(), data: cleanedFormData },
        {
          onSuccess: () => {
            if (onSync) onSync();
          },
        }
      );
    }
  };

  // Verifica se il prodotto è in sconto
  const verificaSconto = () => {
    if ((watch('dateOnSaleFrom') || watch('dateOnSaleTo')) && !watch('salePrice')) {
      alert('Inserisci prezzo sconto se è stato selezionato "Sconto DA" o "Sconto A"');
      return false;
    }
    return true;
  };

  const resetAllFiles = () => {
    setSelectedFiles([]);
    setSelectedExistingFiles([]);
  };

  const salvaProdotto = async (formData: any) => {
    // Le immagini sono già state preparate e aggiunte al formData
    // tramite setValue('images', ...) nella funzione handleUploadModalConfirm
    // Rimuovi campi read-only prima di inviare
    const cleanedData = removeReadOnlyFields(formData);

    if (prodotto?.id) {
      updateProdotto(
        { id: prodotto.id.toString(), data: cleanedData },
        {
          onSuccess: () => {
            resetAllFiles();
            if (onSync) onSync();
          },
        }
      );
    } else {
      storeProdotto(cleanedData, {
        onSuccess: async (prodotto: Prodotto) => {
          resetAllFiles();
          if (onSync) onSync();
        },
      });
    }
  };

  // Gestione del submit con verifica sconto
  const handleFormSubmit = (data: any) => {
    if (!verificaSconto()) {
      return;
    }

    // Validazione del form
    const isValid = Object.keys(formErrors).length === 0;
    if (!isValid) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const formData = {
      ...data,
      // immagini_nomi: data.immagini_nomi_string.split(','),
      // Converti le date nel formato ISO 8601 richiesto da WooCommerce
      // Formato esatto: "YYYY-MM-DDTHH:mm:ss" (es: "2025-10-06T00:00:00")
      // Entrambe le date con ora 00:00:00
      dateOnSaleFrom:
        data.dateOnSaleFrom && data.dateOnSaleFrom.trim() !== ''
          ? dayjs(data.dateOnSaleFrom, 'DD-MM-YYYY').isValid()
            ? dayjs(data.dateOnSaleFrom, 'DD-MM-YYYY').startOf('day').format('YYYY-MM-DDTHH:mm:ss')
            : null
          : null,
      dateOnSaleTo:
        data.dateOnSaleTo && data.dateOnSaleTo.trim() !== ''
          ? dayjs(data.dateOnSaleTo, 'DD-MM-YYYY').isValid()
            ? dayjs(data.dateOnSaleTo, 'DD-MM-YYYY').startOf('day').format('YYYY-MM-DDTHH:mm:ss')
            : null
          : null,
      // Rimuovi i campi GMT che potrebbero causare conflitti
      dateOnSaleFromGmt: undefined,
      dateOnSaleToGmt: undefined,
      // Aggiungi i metaData modificati
      //metaData: metaData,
    };

    // Trasforma categories nel formato WooCommerce
    // Il componente ProdottoCategoriesSelect ritorna già il formato corretto
    if (Array.isArray(data.categories)) {
      formData.categories = data.categories
        .filter((cat: any) => cat && cat.id && cat.name && cat.slug)
        .map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        }));
    }

    // La validazione e sanitizzazione dei campi critici (status, type, brands, metaData)
    // è ora gestita direttamente negli hooks usePutProdotto e usePostProdotto

    // Pulisci i campi vuoti prima di inviare
    const cleanedFormData = cleanEmptyFields(formData);

    salvaProdotto(cleanedFormData);
  };

  // Aggiungi questa funzione per prevenire il comportamento predefinito del form
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(handleFormSubmit)();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const currentImages = prodotto?.images || [];
      const oldIndex = currentImages.findIndex((img) => img.src === active.id);
      const newIndex = currentImages.findIndex((img) => img.src === over.id);

      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== -1 && newIndex !== -1) {
        // Crea un nuovo array di immagini con l'ordine aggiornato usando arrayMove
        const reorderedImages = arrayMove(currentImages, oldIndex, newIndex);
        setValue('images', reorderedImages as any);
        // L'ordine è ora salvato nel form state e verrà salvato sul server premendo "Salva Prodotto"
      }
    }
  };

  const handleUploadModalConfirm = async () => {
    const existingImages = prodotto?.images || [];
    const newImagesForApi = selectedFiles.map((file, index) => ({
      id: file.id,
      name: file.slug || file.name,
      src: file.sourceUrl || file.src,
      alt: file.alt || file.altText || '',
    }));

    // Combina immagini esistenti con le nuove
    // Rimuovi eventuali duplicati basandosi sull'id
    const existingIds = new Set(existingImages.map((img) => img.id));
    const filteredNewImages = newImagesForApi.filter((img) => !existingIds.has(img.id));
    const combinedImages = [...existingImages, ...filteredNewImages];
    setValue('images', combinedImages as any);
    if (prodotto?.id) {
      const formData = watch();
      formData.images = combinedImages;
      const cleanedFormData = cleanEmptyFields(formData);

      updateProdotto(
        { id: prodotto.id.toString(), data: cleanedFormData },
        {
          onSuccess: () => {
            if (onSync) onSync();
            setIsUploadModalOpen(false);
            setSelectedFiles([]); // Reset dei file selezionati
          },
          onError: () => {
            // Mantieni la modale aperta in caso di errore
            console.error('Errore durante il salvataggio delle immagini');
          },
        }
      );
    } else {
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
    }
  };

  return (
    <Box>
      {/* Aggiungiamo un header fisso con i pulsanti di azione */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: 'background.paper',
          borderColor: 'divider',
          py: 2,
          px: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 0,
        }}
      >
        <Typography variant="h4" maxWidth={600}>
          {prodotto?.id ? prodotto.name : 'Nuovo prodotto'}
        </Typography>

        <Box display="flex" gap={2}>
          {loading || isStoreLoading || isUpdateLoading || isDeleteLoading ? (
            <Box display="flex" alignItems="center">
              <Typography variant="body2" mr={1}>
                Aggiornamento prodotto
              </Typography>
              <CircularProgress size={20} />
            </Box>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:arrow-back-fill" />}
                onClick={() => navigate('/prodotti')}
              >
                Lista prodotti
              </Button>
              {prodotto?.id && (
                <>
                  {(() => {
                    const permalink = import.meta.env.DEV
                      ? prodotto?.permalink?.replace('https://', 'http://')
                      : prodotto?.permalink?.replace('https://', 'http://');
                    return (
                      <Button
                        variant="outlined"
                        component="a"
                        href={permalink}
                        target="_blank"
                        startIcon={<i className="pi pi-eye"></i>}
                      >
                        Vedi Prodotto
                      </Button>
                    );
                  })()}
                </>
              )}

              {prodotto?.id && prodotto.status === 'trash' ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<i className="pi pi-save"></i>}
                  onClick={onFormSubmit}
                >
                  Ripristina Prodotto
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<i className="pi pi-save"></i>}
                  onClick={onFormSubmit}
                >
                  {prodotto?.status === 'trash' ? 'Ripristina Prodotto' : 'Salva Prodotto'}
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>

      <Paper sx={{ px: 2, mb: 4, py: 1 }}>
        <form onSubmit={onFormSubmit} noValidate style={{ width: '100%' }}>
          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              {prodotto?.id && (
                <>
                  <Box display="flex" flexWrap="wrap" gap={1.5} mb={1}>
                    <Chip
                      icon={<Iconify icon="solar:calendar-add-bold" width={18} />}
                      label={`Pubblicato: ${formatDateTime(prodotto.dateCreated)}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                    <Chip
                      icon={<Iconify icon="solar:pen-bold" width={18} />}
                      label={`Modificato: ${formatDateTime(prodotto.dateModified)}`}
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  </Box>

                  <Box display="flex" flexWrap="wrap" gap={1.5} mb={3} mt={2}>
                    {/* Stock Status */}
                    {prodotto.stockStatus === 'instock' && (
                      <Chip
                        icon={<Iconify icon="solar:check-circle-bold" width={18} />}
                        label="Stock"
                        size="small"
                        color="success"
                      />
                    )}
                    {prodotto.stockStatus === 'onbackorder' && (
                      <Chip
                        icon={<Iconify icon="solar:clock-circle-bold" width={18} />}
                        label="Ordini arretrati"
                        size="small"
                        color="warning"
                      />
                    )}
                    {prodotto.stockStatus === 'outofstock' && (
                      <Chip
                        icon={<Iconify icon="solar:close-circle-bold" width={18} />}
                        label="Out of stock"
                        size="small"
                        color="error"
                      />
                    )}

                    {/* Trash Status */}
                    {prodotto.status === 'trash' && (
                      <Chip
                        icon={<Iconify icon="solar:trash-bin-trash-bold" width={18} />}
                        label="Prodotto nel cestino"
                        size="small"
                        color="warning"
                      />
                    )}

                    {/* Sale Status */}
                    {prodotto.onSale && (
                      <Chip
                        icon={<Iconify icon="solar:tag-price-bold" width={18} />}
                        label="In saldo"
                        size="small"
                        color="info"
                      />
                    )}
                  </Box>
                </>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="SKU"
                id="sku"
                sx={{ '& .MuiOutlinedInput-root': { borderWidth: 2, borderColor: '#000' } }}
                {...register('sku')}
                error={!!formErrors.sku}
                helperText={formErrors.sku?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Nome"
                id="name"
                {...register('name', { required: 'Il nome è obbligatorio' })}
                error={!!formErrors.name}
                helperText={formErrors.name?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="type-label">Tipo di prodotto</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  label="Tipo di prodotto"
                  defaultValue={prodotto?.type || 'simple'}
                  {...register('type')}
                >
                  {prodottoTipi.map((tipo) => (
                    <MenuItem key={tipo.value} value={tipo.value}>
                      {tipo.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Slug"
                id="slug"
                placeholder="Lo slug verrà compilato in automatico"
                {...register('slug')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Stato prodotto</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  defaultValue={prodotto?.status || 'publish'}
                  label="Stato prodotto"
                  {...register('status')}
                >
                  {prodottoStati.map((stato) => (
                    <MenuItem key={stato.value} value={stato.value}>
                      {stato.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="catalog-visibility-label">Visibilità catalogo</InputLabel>
                <Select
                  labelId="catalog-visibility-label"
                  id="catalogVisibility"
                  defaultValue={prodotto?.catalogVisibility || 'visible'}
                  label="Visibilità catalogo"
                  {...register('catalogVisibility')}
                >
                  {catalogVisibilityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Classe di spedizione"
                id="shippingClass"
                {...register('shippingClass')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ProdottoTagsSelect
                value={watch('tags')}
                onChange={(tags) => setValue('tags', tags as any)}
                perPage={25}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ProdottoBrandsSelect
                value={watch('brands')}
                onChange={(brands) => setValue('brands', brands as any)}
                perPage={25}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ProdottoCategoriesSelect
                value={watch('categories')}
                onChange={(categories) => setValue('categories', categories as any)}
                perPage={25}
              />
            </Grid>

            {productType === 'simple' && (
              <Grid item xs={12} mt={0} sx={{ paddingTop: '0px !important' }}>
                <Accordion defaultExpanded sx={getAccordionStyles('Prezzi')}>
                  <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                    <Typography>Prezzi</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={2}>
                        <NumericFormat
                          customInput={TextField}
                          fullWidth
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          value={watch('regularPrice')}
                          onValueChange={(values) => {
                            setValue('regularPrice', values.value);
                          }}
                          label="Listino"
                          InputProps={{ endAdornment: '€' }}
                          {...register('regularPrice')}
                        />
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <NumericFormat
                          customInput={TextField}
                          fullWidth
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          value={watch('salePrice')}
                          label="Sconto"
                          InputProps={{ endAdornment: '€' }}
                          onValueChange={(values) => {
                            setValue('salePrice', values.value);
                          }}
                          {...register('salePrice')}
                        />
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <NumericFormat
                          customInput={TextField}
                          fullWidth
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          value={watch('price')}
                          label="Vendita"
                          InputProps={{ endAdornment: '€' }}
                          disabled
                          {...register('price')}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <DatePicker
                          label="Data inizio sconto"
                          format="DD-MM-YYYY"
                          value={
                            watch('dateOnSaleFrom')
                              ? dayjs(watch('dateOnSaleFrom'), 'DD-MM-YYYY')
                              : null
                          }
                          onChange={(data) => {
                            setValue(
                              'dateOnSaleFrom',
                              data ? dayjs(data).format('DD-MM-YYYY') : ''
                            );
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!formErrors.dateOnSaleFrom,
                            },
                            field: {
                              clearable: true,
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <DatePicker
                          format="DD-MM-YYYY"
                          label="Pianifica sconto a"
                          value={
                            watch('dateOnSaleTo')
                              ? dayjs(watch('dateOnSaleTo'), 'DD-MM-YYYY')
                              : null
                          }
                          onChange={(data) => {
                            setValue('dateOnSaleTo', data ? dayjs(data).format('DD-MM-YYYY') : '');
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!formErrors.dateOnSaleTo,
                              helperText: formErrors.dateOnSaleTo?.message,
                            },
                            field: {
                              clearable: true,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )}

            <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
              <Accordion defaultExpanded={true} sx={getAccordionStyles('Immagini')}>
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                  <Typography>Immagini</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    {formImages && formImages?.length > 0 && (
                      <Grid item xs={12}>
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                            <SortableContext
                              items={
                                formImages?.map((img) => img.src || '').filter((src) => src) || []
                              }
                            >
                              {formImages?.map((immagine, index) => (
                                <SortableImage
                                  key={immagine.src}
                                  immagine={immagine}
                                  index={index}
                                  onDelete={handleProdottoImmagineRimuovi}
                                />
                              ))}
                            </SortableContext>
                          </Box>
                        </DndContext>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Button
                          variant="outlined"
                          onClick={() => setIsUploadModalOpen(true)}
                          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                        >
                          Carica immagini
                        </Button>

                        {selectedFiles.length > 0 && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              bgcolor: 'success.lighter',
                              px: 2.5,
                              py: 1.5,
                              borderRadius: 2,
                              border: '2px solid',
                              borderColor: 'success.main',
                              boxShadow: '0 2px 8px rgba(0,200,83,0.15)',
                            }}
                          >
                            <Iconify
                              icon="eva:checkmark-circle-2-fill"
                              color="success.main"
                              width={24}
                            />
                            <Typography variant="subtitle2" color="success.dark" fontWeight={600}>
                              {selectedFiles.length}{' '}
                              {selectedFiles.length === 1 ? 'immagine' : 'immagini'} pronta per il
                              caricamento
                            </Typography>
                            <Chip
                              label={selectedFiles.length}
                              color="success"
                              size="small"
                              sx={{ fontWeight: 700, fontSize: '0.85rem' }}
                            />
                          </Box>
                        )}
                      </Box>

                      <UploadModal
                        open={isUploadModalOpen}
                        onClose={() => {
                          setIsUploadModalOpen(false);
                          setSelectedFiles([]);
                          setSelectedExistingFiles([]);
                        }}
                        selectedFiles={selectedFiles}
                        selectedExistingFiles={selectedExistingFiles}
                        onSelectedFilesChange={setSelectedFiles}
                        onSelectedExistingFilesChange={setSelectedExistingFiles}
                        onConfirm={handleUploadModalConfirm}
                        isLoading={isUpdateLoading}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>

            {STOCK_ENABLED === '1' && (
              <Grid item xs={12} pt={0} sx={{ paddingTop: '0px !important' }}>
                <Accordion sx={getAccordionStyles('Magazzino')} defaultExpanded={true}>
                  <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                    <Typography>Magazzino</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={2}>
                        <Typography gutterBottom>Gestione magazzino</Typography>
                        <Switch
                          {...register('manageStock')}
                          defaultChecked={prodotto?.manageStock || false}
                        />
                      </Grid>

                      {manageStock && (
                        <Grid item xs={12} md={2}>
                          <TextField
                            fullWidth
                            label="Quantità in magazzino"
                            type="number"
                            {...register('stockQuantity')}
                          />
                        </Grid>
                      )}

                      {!manageStock && (
                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth>
                            <InputLabel id="stock-status-label">Stato Stock</InputLabel>
                            <Select
                              labelId="stock-status-label"
                              id="stockStatus"
                              label="Stato Stock"
                              defaultValue={prodotto?.stockStatus || 'instock'}
                              {...register('stockStatus')}
                            >
                              {stockStati.map((stato) => (
                                <MenuItem key={stato.value} value={stato.value}>
                                  {stato.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )}

            {/* <Grid item xs={12} pt={0} sx={{ paddingTop: '0px !important' }}>
              <Accordion sx={getAccordionStyles('SEO')} defaultExpanded={true}>
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                  <Typography>SEO</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Meta title" {...register('meta_title')} />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Meta description (max 155-160 caratteri)"
                        {...register('meta_description')}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid> */}

            <Grid item xs={12} pt={0}>
              <ProdottoDescriptionEditor
                label="Descrizione Breve"
                value={shortDescription}
                onChange={setShortDescription}
                height={300}
                menubar={false}
              />
            </Grid>

            <Grid item xs={12}>
              <ProdottoDescriptionEditor
                label="Descrizione completa"
                value={fullDescription}
                onChange={setFullDescription}
                height={500}
                menubar={true}
              />
            </Grid>

            <Grid item xs={12} pt={0} sx={{ paddingTop: '0px !important' }}>
              {/* Resto del contenuto del form */}
              {prodotto?.id && (
                <Accordion sx={getAccordionStyles('Azioni prodotto')}>
                  <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                    <Typography>Azioni prodotto</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" justifyContent="flex-start" py={3}>
                      <Box>
                        {prodotto.id && prodotto.status === 'trash' && (
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<i className="pi pi-trash"></i>}
                            onClick={() =>
                              handleDelete && handleDelete(prodotto.id?.toString() || '', true)
                            }
                          >
                            Elimina definitivamente prodotto
                          </Button>
                        )}

                        {prodotto.id && prodotto.status !== 'trash' && (
                          <Button
                            sx={{ mr: 2 }}
                            variant="contained"
                            color="error"
                            startIcon={<i className="pi pi-trash"></i>}
                            onClick={() =>
                              handleDelete && handleDelete(prodotto.id?.toString() || '', false)
                            }
                          >
                            Sposta prodotto nel cestino
                          </Button>
                        )}
                      </Box>

                      <Box>
                        {/* {prodotto.status !== 'trash' && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<Iconify icon="vscode-icons:file-type-excel" />}
                              onClick={() => exportProdotto([prodotto.id?.toString() || ''])}
                              sx={{ mr: 2 }}
                            >
                              Esporta prodotto
                            </Button>
                          </>
                        )} */}
                        {prodotto.status === 'trash' && (
                          <Box display="flex" alignItems="center" pt={2}>
                            Nessuna azione disponibile
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>

      {prodotto?.id && (
        <Box mt={4} id="attributi-explode">
          <Box mt={3}>
            <ProdottoAttributiDatatable
              isLoading={loading}
              prodotto_id={prodotto?.id as number}
              prodotto={prodotto}
              prodotto_attributi={prodotto?.attributes || []}
            />
          </Box>

          {prodotto.type === 'variable' ? (
            <Box mt={3} mb={3}>
              {productType === 'variable' && (
                <ProdottoVariazioniDatatable prodotto_id={prodotto.id} prodotto={prodotto} />
              )}
            </Box>
          ) : (
            productType === 'variable' && (
              <Alert severity="info" sx={{ mt: 5 }}>
                <Typography align="center">
                  <b>Non puoi gestire le variazioni</b> perché non sono presenti Attributi che usano
                  le Variazioni
                </Typography>
              </Alert>
            )
          )}
        </Box>
      )}
    </Box>
  );
}
