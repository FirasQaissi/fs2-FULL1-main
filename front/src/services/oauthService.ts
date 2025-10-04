import { API_BASE } from './http';

const OAUTH_BASE = `${API_BASE}/api/auth`;

// Environment detection for production URLs
const isProduction = import.meta.env.PROD;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || (isProduction ? 'https://smartgate-kohl.vercel.app' : 'http://localhost:5173');

console.log('Frontend OAuth Configuration:', {
  environment: isProduction ? 'production' : 'development',
  apiBase: API_BASE,
  frontendUrl: FRONTEND_URL
});

export const oauthService = {
  /**
   * Initiate Google OAuth flow
   */
  async initiateGoogleAuth(): Promise<void> {
    console.log('Initiating Google OAuth...');
    
    try {
      // Wake up the server to prevent cold start
      console.log('Waking up server...');
      await fetch(`${API_BASE.replace('/api', '')}/wake`);
      console.log('Server is awake');
    } catch (error) {
      console.log('Server wake up failed, proceeding anyway:', error);
    }
    
    // Proceed with OAuth
    const googleAuthUrl = `${OAUTH_BASE}/google`;
    console.log('Google OAuth URL:', googleAuthUrl);
    window.location.href = googleAuthUrl;
  },

  /**
   * Open OAuth popup window
   */
  openOAuthPopup(provider: 'google'): Promise<{ success: boolean; user?: unknown; token?: string; error?: string }> {
    return new Promise((resolve) => {
      console.log(`Opening ${provider} OAuth popup...`);

      const authUrl = `${OAUTH_BASE}/${provider}`;
      const popup = window.open(
        authUrl,
        `${provider}Auth`,
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        console.error('Failed to open popup - popup blocked');
        resolve({ success: false, error: 'Popup blocked by browser' });
        return;
      }

      // Listen for popup messages
      const messageHandler = (event: MessageEvent) => {
        console.log('Received message from popup:', event.data);

        // Accept messages from any origin for OAuth popup communication
        if (event.data.type === 'OAUTH_SUCCESS') {
          console.log('OAuth success received:', event.data);
          popup.close();
          window.removeEventListener('message', messageHandler);
          resolve({
            success: true,
            user: event.data.user,
            token: event.data.token
          });
        } else if (event.data.type === 'OAUTH_ERROR') {
          console.error('OAuth error received:', event.data);
          popup.close();
          window.removeEventListener('message', messageHandler);
          resolve({
            success: false,
            error: event.data.error
          });
        }
      };

      window.addEventListener('message', messageHandler);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          console.log('Popup closed');
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          resolve({ success: false, error: 'Authentication cancelled' });
        }
      }, 1000);

      // Check if popup is showing Render loading screen
      const checkLoading = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(checkLoading);
            return;
          }
          
          // Check if popup URL contains the callback
          if (popup.location.href.includes('/api/auth/google/callback')) {
            console.log('OAuth callback detected, waiting for completion...');
            clearInterval(checkLoading);
          }
        } catch (e) {
          // Cross-origin access blocked, which is normal
        }
      }, 500);

      // Timeout after 2 minutes (reduced from 5 minutes)
      setTimeout(() => {
        if (!popup.closed) {
          console.log('OAuth timeout');
          popup.close();
          clearInterval(checkClosed);
          clearInterval(checkLoading);
          window.removeEventListener('message', messageHandler);
          resolve({ success: false, error: 'Authentication timeout' });
        }
      }, 120000); // 2 minutes
    });
  }
};
