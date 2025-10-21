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
  IconButton,
  Checkbox,
  ListItemText,
} from '@mui/material';

import { useState, useEffect } from 'react';
import { Prodotto } from 'src/types/Prodotto';
import { Iconify } from 'src/components/iconify';
import { formatDateTime } from 'src/hooks/use-format-date';
import { useGetAllCategories } from 'src/hooks/useGetCategorie';
import { usePostProdotto } from 'src/hooks/usePostProdotto';
import { usePutProdotto } from 'src/hooks/usePutProdotto';
import { useDeleteProdotto } from 'src/hooks/useDeleteProdotto';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useGetAllTags } from 'src/hooks/useGetTags';
import { useGetAllBrands } from 'src/hooks/useGetBrand';
import { ProdottoAttributiDatatable } from './prodotto-attributi-table';
import { ProdottoVariazioniDatatable } from './prodotto-variazioni-datatable';
import { STOCK_ENABLED } from 'src/utils/const';
import { removeReadOnlyFields } from 'src/utils/prodotto-utils';
import { CategorieTreeView, CategoryState } from 'src/components/CategorieTreeView';
import { GenericModal } from 'src/components/generic-modal/GenericModal';
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
import { Editor } from '@tinymce/tinymce-react';
import { useGetFiles } from 'src/hooks/useGetFiles';
import { UploadModal } from 'src/components/upload-modal/UploadModal';
import { useDevUrl } from 'src/hooks/useDevUrl';
import { Categoria } from 'src/types/Categoria';
import { useProdottoStatus } from 'src/hooks/useProdottoStatus';
import { useGetStockStati } from 'src/hooks/useGetStockStati';
import {
  ProdottoStatusLabel,
  StockStatusLabel,
  CatalogVisibilityLabel,
} from 'src/types/ProdottoEnums';

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
        brands: prodotto.brands || [],
      });
    }
  }, [prodotto, reset, setValue]);

  const navigate = useNavigate();
  const productType = watch('type');
  const manageStock = watch('manageStock');
  const { convertUrl } = useDevUrl();
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
    // { name: ProdottoStatusLabel[ProdottoStatus.FUTURE], value: ProdottoStatus.FUTURE },
    //{ name: ProdottoStatusLabel[ProdottoStatus.TRASH], value: ProdottoStatus.TRASH },
    //{ name: ProdottoStatusLabel[ProdottoStatus.AUTO_DRAFT], value: ProdottoStatus.AUTO_DRAFT },
    //{ name: ProdottoStatusLabel[ProdottoStatus.INHERIT], value: ProdottoStatus.INHERIT },
  ];

  const stockStati = useGetStockStati();

  const catalogVisibilityOptions = [
    { name: CatalogVisibilityLabel[CatalogVisibility.VISIBLE], value: CatalogVisibility.VISIBLE },
    { name: CatalogVisibilityLabel[CatalogVisibility.CATALOG], value: CatalogVisibility.CATALOG },
    { name: CatalogVisibilityLabel[CatalogVisibility.SEARCH], value: CatalogVisibility.SEARCH },
    { name: CatalogVisibilityLabel[CatalogVisibility.HIDDEN], value: CatalogVisibility.HIDDEN },
  ];

  const { data: categorie } = useGetAllCategories();

  // Funzione helper per costruire la gerarchia delle categorie
  const buildCategoryTree = (categories: Categoria[] | undefined): Categoria[] => {
    if (!categories) return [];
    const categoryMap = new Map<number, Categoria>();
    const rootCategories: Categoria[] = [];

    // Prima passata: crea la mappa e inizializza l'array children
    categories.forEach((cat) => {
      if (cat.id) {
        categoryMap.set(cat.id, { ...cat, children: [] });
      }
    });
    // Seconda passata: costruisci la gerarchia
    categoryMap.forEach((cat) => {
      if (cat.parent && cat.parent !== 0) {
        const parentCat = categoryMap.get(cat.parent);
        if (parentCat) {
          // Ha un parent valido, aggiungilo come child
          parentCat.children!.push(cat);
        } else {
          // Parent non trovato, mettilo nelle root
          rootCategories.push(cat);
        }
      } else {
        // Nessun parent, è una categoria root
        rootCategories.push(cat);
      }
    });

    return rootCategories;
  };

  // Costruisci l'albero gerarchico delle categorie
  const categorieTree = buildCategoryTree(categorie);

  const { data: tags, isFetching, isRefetching } = useGetAllTags();
  const { data: brands } = useGetAllBrands();
  const { mutate: storeProdotto, isPending: isStoreLoading } = usePostProdotto();
  const { mutate: updateProdotto, isPending: isUpdateLoading } = usePutProdotto(
    prodotto?.id as number
  );
  const { mutate: deleteProdotto, isPending: isDeleteLoading } = useDeleteProdotto(
    prodotto?.id as number
  );

  // const { mutate: exportProdotto, isPending: isExportLoading } = useExportProdotti();
  // Gestione upload immagini
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [selectedExistingFiles, setSelectedExistingFiles] = useState<Media[]>([]);

  // Aggiungi questi stati per gestire i valori dell'editor
  const [shortDescription, setShortDescription] = useState(prodotto?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(prodotto?.description || '');

  // Stato per gestire i metaData
  // WooCommerce usa 'name' ma noi mappiamo a 'key' per consistenza
  const [metaData, setMetaData] = useState<
    Array<{ id?: number; key?: string; name?: string; value?: string }>
  >(
    prodotto?.metaData?.map((meta) => {
      const metaAny = meta as any;
      return {
        ...meta,
        key: metaAny.key || metaAny.name,
        name: metaAny.name || metaAny.key,
      };
    }) || []
  );

  // Aggiungi questo stato per gestire l'apertura/chiusura della modal
  const [isCategorieModalOpen, setIsCategorieModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showExistingFiles, setShowExistingFiles] = useState(false);

  // Aggiorna i valori del form quando cambiano gli editor
  useEffect(() => {
    setValue('shortDescription', shortDescription as never);
  }, [shortDescription, setValue]);

  useEffect(() => {
    setValue('description', fullDescription as never);
  }, [fullDescription, setValue]);

  // Aggiorna metaData quando cambia il prodotto
  useEffect(() => {
    if (prodotto?.metaData) {
      setMetaData(
        prodotto.metaData.map((meta) => {
          const metaAny = meta as any;
          return {
            ...meta,
            key: metaAny.key || metaAny.name,
            name: metaAny.name || metaAny.key,
          };
        })
      );
    }
  }, [prodotto?.metaData]);

  // Configurazione dei moduli per l'editor Quill
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleDelete = (id: string, force: boolean) => {
    deleteProdotto({ force });
    if (onDelete) onDelete(id, force);
  };

  // Aggiungi questa funzione helper all'inizio del componente ProdottoForm
  const getAccordionStyles = (title: string) => {
    // Colori diversi per ogni tipo di accordion
    const colorMap: Record<string, string> = {
      'Azioni prodotto': '#fff',
      'Categorie, Tag': '#fff',
      Prezzi: '#fff',
      Immagini: '#fff',
      Magazzino: '#fff',
      SEO: '#fff',
    };

    // Colori per i bordi
    const borderMap: Record<string, string> = {
      'Azioni prodotto': 'primary.dark',
      'Categorie, Tag': 'success.main',
      Prezzi: 'warning.main',
      Immagini: 'secondary.main',
      Magazzino: 'info.main',
      SEO: 'error.main',
    };

    return {
      borderRadius: 2,
      mb: 2,
      border: '1px solid',
      borderColor: 'divider',
      marginTop: '10px !important',
      padding: '10px !important',
      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
      '&:before': {
        display: 'none', // Rimuovi il bordo default di MUI
      },
      '& .MuiAccordionSummary-root': {
        // backgroundColor: colorMap[title],
        borderRadius: '8px 8px 0 0',
        transition: 'all 0.2s ease-in-out',
        // padding: '12px 24px',
        margin: '0px !important',
        paddingY: '0px !important',
        paddingX: '10px !important',

        '& .MuiTypography-root': {
          fontWeight: 600,
          color: (theme: any) => theme.palette[borderMap[title]],
        },
      },
      '& .MuiAccordionDetails-root': {
        paddingY: '0px !important',
        paddingX: '10px !important',
        //backgroundColor: 'rgba(255, 255, 255, 0.8)',
      },
    };
  };

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

  // Effetto per caricare le immagini quando vengono selezionate
  useEffect(() => {
    if (selectedFiles.length > 0 && prodotto?.id) {
      // Le immagini vengono gestite tramite handleUploadModalConfirm
      // quando l'utente conferma la selezione nel modal
    }
  }, [selectedFiles, prodotto?.id]);
  //const categorie_id = watch('categorie_id');

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

  // Funzione per pulire i campi vuoti dall'oggetto
  const cleanEmptyFields = (obj: any): any => {
    const cleaned: any = {};

    Object.keys(obj).forEach((key) => {
      let value = obj[key];

      // Se è una stringa, fai trim
      if (typeof value === 'string') {
        value = value.trim();
      }

      // Salta i valori null, undefined o stringhe vuote (anche dopo trim)
      // WooCommerce non accetta stringhe vuote, preferisce l'assenza del campo
      if (value === null || value === undefined || value === '') {
        return;
      }

      // Se è un array vuoto, salta
      if (Array.isArray(value) && value.length === 0) {
        return;
      }

      // Se è un oggetto (come dimensions), puliscilo ricorsivamente
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        const cleanedNested = cleanEmptyFields(value);
        // Aggiungi solo se l'oggetto pulito non è vuoto
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
        return;
      }

      // Mantieni il valore se non è vuoto
      cleaned[key] = value;
    });

    return cleaned;
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

    // Conferma per prodotti eliminati
    // if (prodotto?.deleted === true) {
    //   if (
    //     !window.confirm(
    //       'Il prodotto non è presente su Woocomerce. Vuoi procedere con la pubblicazione su Woocomerce?'
    //     )
    //   ) {
    //     return;
    //   }
    // }

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
      metaData: metaData,
    };

    // Trasforma categories da oggetto a array nel formato WooCommerce
    if (data.categories && typeof data.categories === 'object' && !Array.isArray(data.categories)) {
      const selectedIds = Object.keys(data.categories).filter((id) => data.categories[id]?.checked);
      formData.categories = selectedIds
        .map((id) => {
          const categoria = categorie?.find((cat) => cat.id?.toString() === id);
          return categoria
            ? {
                id: categoria.id,
                name: categoria.name,
                slug: categoria.slug,
              }
            : null;
        })
        .filter(Boolean);
    } else if (Array.isArray(data.categories)) {
      // Se è già un array, assicurati che abbia il formato corretto
      formData.categories = data.categories
        .map((cat: any) => {
          if (typeof cat === 'object' && cat.id && cat.name && cat.slug) {
            return { id: cat.id, name: cat.name, slug: cat.slug };
          } else if (typeof cat === 'object' && cat.id) {
            // Ha solo l'id, trova i dettagli completi
            const categoria = categorie?.find((c) => c.id === cat.id);
            return categoria
              ? { id: categoria.id, name: categoria.name, slug: categoria.slug }
              : null;
          } else if (typeof cat === 'number' || typeof cat === 'string') {
            // È solo un id
            const categoria = categorie?.find((c) => c.id?.toString() === cat.toString());
            return categoria
              ? { id: categoria.id, name: categoria.name, slug: categoria.slug }
              : null;
          }
          return null;
        })
        .filter(Boolean);
    }

    // Assicurati che i campi critici siano presenti
    if (!formData.status || formData.status.trim() === '') {
      formData.status = 'draft'; // Default a bozza se non specificato
    }
    if (!formData.type || formData.type.trim() === '') {
      formData.type = 'simple'; // Default a semplice se non specificato
    }

    // Assicurati che brands sia nel formato corretto (array di oggetti con solo id)
    if (formData.brands && Array.isArray(formData.brands)) {
      formData.brands = formData.brands.map((brand: any) => ({ id: brand.id }));
    }

    // Pulisci i metaData rimuovendo quelli con valori vuoti
    if (formData.metaData && Array.isArray(formData.metaData)) {
      formData.metaData = formData.metaData.filter((meta: any) => {
        // Mantieni solo i metaData con valori non vuoti
        return meta.value !== null && meta.value !== undefined && meta.value !== '';
      });

      // Se non ci sono metaData validi, rimuovi completamente l'array
      if (formData.metaData.length === 0) {
        delete formData.metaData;
      }
    }

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
        if (prodotto?.id) {
          const formData = watch(); // Ottieni tutti i dati del form
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
              <FormControl fullWidth>
                <InputLabel id="tags-label">Tags</InputLabel>
                <Select
                  labelId="tags-label"
                  id="tags"
                  label="Tags"
                  multiple
                  value={watch('tags')?.map((tag: any) => tag.id?.toString()) || []}
                  onChange={(e) => {
                    const selectedIds = e.target.value as string[];
                    const selectedTags = selectedIds
                      .map((id) => tags?.find((tag) => tag.id?.toString() === id))
                      .filter(Boolean)
                      .map((tag) => ({
                        id: tag!.id,
                        name: tag!.name,
                        slug: tag!.slug,
                      }));
                    setValue('tags', selectedTags as any);
                  }}
                  renderValue={(selected: string[]) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value: string) => (
                        <Chip
                          key={value}
                          label={tags?.find((tag) => tag.id?.toString() === value)?.name || value}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {tags?.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id?.toString() || ''}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="brands-label">Brands</InputLabel>
                <Select
                  labelId="brands-label"
                  id="brands"
                  label="Brands"
                  multiple
                  value={watch('brands')?.map((b) => b.id?.toString()) || []}
                  onChange={(e) => {
                    const selectedIds = e.target.value as string[];
                    const selectedBrands = selectedIds
                      .map((id) => brands?.find((b) => b.id?.toString() === id))
                      .filter(Boolean)
                      .map((brand) => ({
                        id: brand!.id,
                        name: brand!.name,
                        slug: brand!.slug,
                      }));
                    setValue('brands', selectedBrands as any);
                  }}
                  renderValue={(selected: string[]) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value: string) => (
                        <Chip
                          key={value}
                          label={brands?.find((b) => b.id?.toString() === value)?.name || value}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {brands?.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id?.toString() || ''}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} mt={1}>
              <Button
                variant="outlined"
                onClick={() => setIsCategorieModalOpen(true)}
                startIcon={<Iconify icon="eva:list-fill" />}
              >
                Gestisci Categorie
              </Button>

              <GenericModal
                title="Gestione Categorie"
                open={isCategorieModalOpen}
                onClose={() => setIsCategorieModalOpen(false)}
                maxWidth="xs"
              >
                <Box sx={{ p: 2 }}>
                  <FormControl fullWidth>
                    <CategorieTreeView
                      categorie={categorieTree}
                      selectedStates={(() => {
                        const currentCategories = watch('categories');

                        // Se currentCategories è un oggetto Record<string, CategoryState>, ritornalo
                        if (
                          currentCategories &&
                          typeof currentCategories === 'object' &&
                          !Array.isArray(currentCategories)
                        ) {
                          return currentCategories as Record<string, CategoryState>;
                        }

                        // Se è un array, convertilo in Record<string, CategoryState>
                        if (Array.isArray(currentCategories)) {
                          return currentCategories.reduce(
                            (acc: Record<string, CategoryState>, cat: any) => ({
                              ...acc,
                              [cat.id]: { checked: true, partialChecked: false },
                            }),
                            {}
                          );
                        }

                        return {};
                      })()}
                      onCategorieChange={(newSelected) => {
                        const validatedSelection = Object.entries(newSelected).reduce(
                          (acc, [id, state]) => {
                            if (state.checked || state.partialChecked) {
                              acc[id] = {
                                checked: Boolean(state.checked),
                                partialChecked: Boolean(state.partialChecked),
                              };
                            }
                            return acc;
                          },
                          {} as Record<string, CategoryState>
                        );

                        // Salva come oggetto, verrà trasformato in array in handleFormSubmit
                        setValue('categories', validatedSelection as any);
                      }}
                    />
                  </FormControl>
                  <Button
                    sx={{ mt: 2 }}
                    fullWidth
                    variant="contained"
                    onClick={() => setIsCategorieModalOpen(false)}
                  >
                    Conferma selezione
                  </Button>
                </Box>
              </GenericModal>
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
                    {prodotto?.images && prodotto?.images?.length > 0 && (
                      <Grid item xs={12}>
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                            <SortableContext
                              items={
                                prodotto?.images
                                  ?.map((img) => img.src || '')
                                  .filter((src) => src) || []
                              }
                            >
                              {prodotto?.images?.map((immagine, index) => (
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
                      {productType === 'simple' && (
                        <Grid item xs={12} md={2}>
                          <Typography gutterBottom>Gestione magazzino</Typography>
                          <Switch
                            {...register('manageStock')}
                            defaultChecked={prodotto?.manageStock || false}
                          />
                        </Grid>
                      )}

                      {productType === 'simple' && manageStock && (
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
              <Typography variant="subtitle1" gutterBottom>
                Descrizione Breve
              </Typography>
              <Editor
                apiKey="fjpuvxdvvk5cjofpllcst021237wbuo6hls9sibgghcqszuc"
                value={shortDescription}
                onEditorChange={(content: any) => setShortDescription(content)}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'help',
                    'wordcount',
                  ],
                  toolbar:
                    'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | table | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Descrizione completa
              </Typography>
              <Editor
                apiKey="fjpuvxdvvk5cjofpllcst021237wbuo6hls9sibgghcqszuc"
                value={fullDescription}
                onEditorChange={(content: any) => setFullDescription(content)}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'help',
                    'wordcount',
                  ],
                  toolbar:
                    'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | table | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
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
