import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { PolicyProvider } from './context/PolicyContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PolicyProvider>
          <App />
        </PolicyProvider>
      </AuthProvider>
    </BrowserRouter>
  // {/* </React.StrictMode> */}
);