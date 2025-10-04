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
  initiateGoogleAuth(): void {
    console.log('Initiating Google OAuth...');
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

        if (event.origin !== window.location.origin) {
          return;
        }

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
          console.log('Popup closed by user');
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          resolve({ success: false, error: 'Authentication cancelled' });
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        if (!popup.closed) {
          console.log('OAuth timeout');
          popup.close();
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          resolve({ success: false, error: 'Authentication timeout' });
        }
      }, 300000); // 5 minutes
    });
  }
};
