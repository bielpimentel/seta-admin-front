import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import AuthGuard from '../utils/guard';

export const IndexPage = lazy(() => import('src/pages/app'));

// ------------------ USUÁRIOS ------------------
export const UsersPage = lazy(() => import('src/pages/users'));
export const UserCreatePage = lazy(() => import('src/pages/users/create'));
export const UserEditPage = lazy(() => import('src/pages/users/edit'));

// --------------- LOGS DE ACESSO ---------------
export const AccessLogsPage = lazy(() => import('src/pages/logs'));

// ------------ CADASTROS PENDENTES -------------
export const PendingRegistersPage = lazy(() => import('src/pages/pending-registers'));

// ------------------ SUPORTE -------------------
export const SupportsPage = lazy(() => import('src/pages/supports'));

// ------------- E-MAILS PERMITIDOS -------------
export const MailExtensionsPage = lazy(() => import('src/pages/mail-extensions'));
export const MailExtensionCreatePage = lazy(() => import('src/pages/mail-extensions/create'));
export const MailExtensionEditPage = lazy(() => import('src/pages/mail-extensions/edit'));

// ------------------ QR CODE -------------------
export const QRCodeReaderPage = lazy(() => import('src/pages/qrcode-reader'));

export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  
  const routes = useRoutes([
    {
      element: (
        <AuthGuard requireAuth={true}>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AuthGuard>
      ),
      children: [
        { path: 'dashboard', element: <IndexPage /> },
        { path: 'usuarios', element: <UsersPage /> },
        { path: 'usuarios/novo', element: <UserCreatePage /> },
        { path: 'usuarios/editar/:id', element: <UserEditPage /> },
        { path: 'logs-de-acesso', element: <AccessLogsPage /> },
        { path: 'cadastros-pendentes', element: <PendingRegistersPage /> },
        { path: 'suporte', element: <SupportsPage /> },
        { path: 'emails-permitidos', element: <MailExtensionsPage /> },
        { path: 'emails-permitidos/novo', element: <MailExtensionCreatePage /> },
        { path: 'emails-permitidos/editar/:id', element: <MailExtensionEditPage /> },
      ],
    },
    {
      path: 'qrcode',
      element: (
        <AuthGuard requireAuth={true} restrictedArea={true}>
          <QRCodeReaderPage />
        </AuthGuard>
      ),
    },
    {
      path: '',
      element: (
        <AuthGuard requireAuth={false}>
          <LoginPage />
        </AuthGuard>
      ),
      index: true
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

  return routes;
}
