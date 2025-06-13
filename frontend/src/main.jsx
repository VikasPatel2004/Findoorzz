import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Your global styles
import App from './App.jsx'; // Your main App component

// Create a root for the application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
