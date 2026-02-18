import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App'
import { ThemeContextProvider } from './contexts/ThemeContext';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <ThemeContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ThemeContextProvider>
)

// Register service worker for offline support (production only)
serviceWorkerRegistration.register();