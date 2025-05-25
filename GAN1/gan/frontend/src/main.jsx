import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastProvider } from './context/ToastContext'
import App from './App.jsx'
import './index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log('Main Entry Google Client ID:', clientId);

// Validate client ID
if (!clientId) {
  console.error(' CRITICAL: Google Client ID is not defined. Check your .env file.');
  // Optional: You could render an error component instead of the app
}

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider 
        clientId={clientId}
        onSuccess={(credentialResponse) => {
          console.log('Global OAuth Provider Success:', {
            credential: credentialResponse.credential ? 'Present' : 'Missing',
            // Avoid logging the full credential for security
            clientId: credentialResponse.clientId
          });
        }}
        onError={(errorResponse) => {
          console.error('Global OAuth Provider Failed:', {
            error: errorResponse.error,
            details: errorResponse.details
          });
          // Optional: Show a toast or error notification
        }}
      >
        <ToastProvider>
          <App />
        </ToastProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
