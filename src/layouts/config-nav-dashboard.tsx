import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

// Funzione per icone SVG locali (mantenuta per compatibilità)
const svgIcon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

// Funzione per icone Iconify
const iconify = (name: string) => <Icon icon={name} width={24} height={24} />;

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: iconify('mdi:view-dashboard'),
  },
  {
    title: 'Prodotti',
    path: '/prodotti',
    icon: iconify('mdi:package-variant-closed'),
  },
  {
    title: 'Categorie',
    path: '/categorie',
    icon: iconify('mdi:folder-outline'),
  },
  {
    title: 'Attributi',
    path: '/attributi',
    icon: iconify('mdi:tune'),
  },
  {
    title: 'Importatore Prodotti',
    path: '/import-prodotti',
    icon: iconify('mdi:import'),
  },
  // {
  //   title: 'Scritture su WooCommerce',
  //   path: '/exports',
  //   icon: iconify('mdi:export'),
  // },
  // {
  //   title: 'Sincronizzazioni da WooCommerce',
  //   path: '/sincronizzazioni',
  //   icon: iconify('mdi:sync'),
  // },
  // {
  //   title: 'SEO Config',
  //   path: '/seo-config',
  //   icon: iconify('mdi:search-web'),
  // },
  {
    title: 'Tags',
    path: '/tags',
    icon: iconify('mdi:tag-outline'),
  },
  {
    title: 'Clienti',
    path: '/clienti',
    icon: iconify('mdi:account-multiple-outline'),
  },
  {
    title: 'Ordini',
    path: '/ordini',
    icon: iconify('mdi:cart-outline'),
  },
  {
    title: 'Media',
    path: '/files',
    icon: iconify('mdi:file-outline'),
  },
  {
    title: 'Brands',
    path: '/brands',
    icon: iconify('mdi:tag-outline'),
  },
  // {
  //   title: 'Log Errori',
  //   path: '/errors',
  //   icon: iconify('mdi:alert-circle-outline'),
  // },
  // {
  //   title: 'User',
  //   path: '/user',
  //   icon: iconify('mdi:account'),
  // },
  // {
  //   title: 'Tags',
  //   path: '/tags',
  //   icon: iconify('mdi:tag-outline'),
  // },
  // {
  //   title: 'Files',
  //   path: '/files',
  //   icon: iconify('mdi:file-outline'),
  // },
  // {
  //   title: 'Import Prodotti',
  //   path: '/import-prodotti',
  //   icon: iconify('mdi:import'),
  // },
  // {
  //   title: 'Attributi',
  //   path: '/attributi',
  //   icon: iconify('mdi:tune'),
  // },
  // {
  //   title: 'SEO Config',
  //   path: '/seo-config',
  //   icon: iconify('mdi:search-web'),
  // },
  // {
  //   title: 'Product',
  //   path: '/products',
  //   icon: icon('ic-cart'),
  //   info: (
  //     <Label color="error" variant="inverted">
  //       +3
  //     </Label>
  //   ),
  // },
  // {
  //   title: 'Blog',
  //   path: '/blog',
  //   icon: icon('ic-blog'),
  // },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
