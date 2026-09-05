import { StrictMode } from 'react';
import '@fontsource/inter';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider.tsx';

import './index.css'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css'

import { router } from './routes/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
        <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
)
