import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddRoundPage from './pages/AddRoundPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import ErrorBoundary from './components/ErrorBoundary';

// Create router with all our routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/add',
    element: (
      <ProtectedRoute>
        <AddRoundPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <HistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

const App: React.FC = () => {
  return (
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
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

const AppWithProviders: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastProvider>
  );
};

export default AppWithProviders;
