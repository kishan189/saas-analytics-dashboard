import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import { router } from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

createRoot(document.getElementById('root')!).render(
  
    <ErrorBoundary>
      <Provider store={store}>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'dark:bg-gray-800 dark:text-white',
              style: {
                background: 'var(--toast-bg, #363636)',
                color: 'var(--toast-color, #fff)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Suspense>
      </Provider>
    </ErrorBoundary>
);
