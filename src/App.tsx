import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages to reduce initial bundle size
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const AddRoundPage = React.lazy(() => import('./pages/AddRoundPage'));
const HistoryPage = React.lazy(() => import('./pages/HistoryPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-stone-50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
  </div>
);

// Root component that will be inside the router
const Root: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ErrorBoundary
          fallback={
            <div className="flex flex-col items-center justify-center h-screen bg-stone-50 p-4">
              <h2 className="text-xl font-bold text-stone-800 mb-2">Something went wrong</h2>
              <p className="text-stone-600 mb-4">We're sorry for the inconvenience</p>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Go to Dashboard
              </button>
            </div>
          }
        >
          <Outlet />
        </ErrorBoundary>
      </ToastProvider>
    </AuthProvider>
  );
};

// Create router with all our routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AddRoundPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <HistoryPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ]
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
