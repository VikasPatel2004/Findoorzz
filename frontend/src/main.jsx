
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'; // Your global styles
import App from './App.jsx'; // Your main App component

// Create a root for the application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="732492530241-92sh1qp4st8dpsb54c8pkpc7g7e380jl.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
