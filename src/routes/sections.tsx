import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import WithAuth from 'src/auth/WithAuth';
import FilesPage from 'src/pages/files';
import AttributiPage from 'src/pages/attributi';
import { BrandsView } from 'src/sections/brands/view/brand-view';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const CategoriePage = lazy(() => import('src/pages/categorie'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const TagsPage = lazy(() => import('src/pages/tags'));
export const ImportProdottiPage = lazy(() => import('src/pages/import-prodotti'));
export const SeoConfigPage = lazy(() => import('src/pages/seo-config'));
export const ProdottiPage = lazy(() => import('src/pages/prodotti'));
export const ProdottoPage = lazy(() => import('src/pages/prodotto'));
export const BrandsPage = lazy(() => import('src/pages/brands'));
// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <WithAuth>
              <Outlet />
            </WithAuth>
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        // { path: 'user', element: <UserPage /> },
        { path: 'categorie', element: <CategoriePage /> },
        { path: 'tags', element: <TagsPage /> },
        { path: 'files', element: <FilesPage /> },
        { path: 'import-prodotti', element: <ImportProdottiPage /> },
        { path: 'attributi', element: <AttributiPage /> },
        { path: 'seo-config', element: <SeoConfigPage /> },
        { path: 'prodotti', element: <ProdottiPage /> },
        { path: 'prodotti/:id', element: <ProdottoPage /> },
        { path: 'brands', element: <BrandsPage /> },
      ],
    },
    {
      path: 'login',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
