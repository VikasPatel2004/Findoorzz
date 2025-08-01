
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'; // Your global styles
import App from './App.jsx'; // Your main App component

// Create a root for the application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="580337284688-pcdfhjr3sstk2qprem9ur6jgh19cq6nl.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
