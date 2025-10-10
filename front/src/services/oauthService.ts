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
   * Wake up the server and wait for it to be ready
   */
  async wakeUpServer(): Promise<boolean> {
    const backendUrl = API_BASE.replace('/api', '');
    console.log('🔄 Waking up backend server...');
    
    // Try to wake up the server with multiple retries
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        console.log(`Wake-up attempt ${attempt}/5...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout per attempt
        
        const response = await fetch(`${backendUrl}/health`, {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log('✅ Server is awake and ready!');
          return true;
        }
        
        console.log(`Attempt ${attempt} got status ${response.status}, retrying...`);
      } catch (error) {
        console.log(`Attempt ${attempt} failed:`, error instanceof Error ? error.message : 'Unknown error');
      }
      
      // Wait before next attempt (progressive backoff)
      if (attempt < 5) {
        const waitTime = attempt * 2000; // 2s, 4s, 6s, 8s
        console.log(`Waiting ${waitTime / 1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    console.warn('⚠️ Server wake-up attempts exhausted, proceeding anyway...');
    return false;
  },

  /**
   * Initiate Google OAuth flow using full-page redirect (fallback method)
   */
  async initiateGoogleAuth(): Promise<void> {
    console.log('🔄 Initiating Google OAuth with full-page redirect...');
    
    // Wake up the server and wait for it to be ready
    await this.wakeUpServer();
    
    // Additional small delay to ensure OAuth route is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Proceed with OAuth using full-page redirect
    const googleAuthUrl = `${OAUTH_BASE}/google`;
    console.log('✅ Redirecting to Google OAuth:', googleAuthUrl);
    window.location.href = googleAuthUrl;
  },

  /**
   * Open OAuth popup window
   */
  openOAuthPopup(provider: 'google'): Promise<{ success: boolean; user?: unknown; token?: string; error?: string }> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      (async () => {
        console.log(`Opening ${provider} OAuth popup...`);

        // ✅ Wake up server BEFORE opening popup
        console.log('Pre-warming backend server for popup OAuth...');
      })();
      await this.wakeUpServer();

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
        // ✅ Filter out non-OAuth messages (React DevTools, etc.)
        if (!event.data || typeof event.data !== 'object') {
          return;
        }

        // Ignore messages from React DevTools and other extensions
        if (event.data.source === 'react-devtools-bridge' || 
            event.data.source === 'react-devtools-content-script' ||
            event.data.source === 'react-devtools-backend') {
          return;
        }

        // ✅ Only process messages with OAuth type (OAUTH_SUCCESS or OAUTH_ERROR)
        if (!event.data.type || (event.data.type !== 'OAUTH_SUCCESS' && event.data.type !== 'OAUTH_ERROR')) {
          return;
        }

        // ✅ Accept messages from backend origin (popup sends from onrender.com)
        const backendOrigin = API_BASE.replace('/api', '');
        const isFromBackend = event.origin === backendOrigin || 
                             event.origin.includes('onrender.com') ||
                             event.origin.includes('render.com');
        
        if (!isFromBackend) {
          console.log('⚠️ Ignoring OAuth message from unexpected origin:', event.origin, '(expected:', backendOrigin, ')');
          return;
        }

        console.log('✅ Received OAuth message from backend:', {
          origin: event.origin,
          type: event.data.type,
          hasUser: !!event.data.user,
          hasToken: !!event.data.token
        });

        // Accept messages from backend for OAuth popup communication
        if (event.data.type === 'OAUTH_SUCCESS') {
          console.log('✅ OAuth success - user logged in!');
          try {
            popup.close();
          } catch (e) {
            console.log('Could not close popup:', e);
          }
          window.removeEventListener('message', messageHandler);
          resolve({
            success: true,
            user: event.data.user,
            token: event.data.token
          });
        } else if (event.data.type === 'OAUTH_ERROR') {
          console.error('❌ OAuth error received:', event.data.error);
          try {
            popup.close();
          } catch (e) {
            console.log('Could not close popup:', e);
          }
          window.removeEventListener('message', messageHandler);
          resolve({
            success: false,
            error: event.data.error
          });
        }
      };

      window.addEventListener('message', messageHandler);

      // ✅ Use a flag to track if we've received a response
      let responseReceived = false;
      const originalMessageHandler = messageHandler;
      const wrappedMessageHandler = (event: MessageEvent) => {
        originalMessageHandler(event);
        // If message was processed, mark as received
        if (event.data && (event.data.type === 'OAUTH_SUCCESS' || event.data.type === 'OAUTH_ERROR')) {
          responseReceived = true;
        }
      };

      window.removeEventListener('message', messageHandler);
      window.addEventListener('message', wrappedMessageHandler);

      // ✅ Timeout after 2 minutes - don't check popup.closed (triggers COOP error)
      const timeoutId = setTimeout(() => {
        if (!responseReceived) {
          console.log('⏱️ OAuth timeout - no response received');
          window.removeEventListener('message', wrappedMessageHandler);
          
          // Try to close popup (may fail due to COOP, but that's okay)
          try {
            popup.close();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            console.log('Could not close popup (COOP restriction)');
          }
          
          resolve({ success: false, error: 'Authentication timeout - please try again' });
        }
      }, 120000); // 2 minutes

      // ✅ Periodically check if popup still exists using a safer method
      let popupCheckCount = 0;
      const popupCheckInterval = setInterval(() => {
        popupCheckCount++;
        
        // Stop checking after we get a response
        if (responseReceived) {
          clearInterval(popupCheckInterval);
          clearTimeout(timeoutId);
          return;
        }

        // After 120 checks (2 minutes at 1 check/second), give up
        if (popupCheckCount > 120) {
          clearInterval(popupCheckInterval);
          return;
        }

        // Try to check if popup is closed (but catch COOP errors)
        try {
          // Try to access popup.location (will throw if cross-origin or closed)
          if (!popup || popup.closed) {
            console.log('🚪 Popup was closed by user');
            clearInterval(popupCheckInterval);
            clearTimeout(timeoutId);
            window.removeEventListener('message', wrappedMessageHandler);
            if (!responseReceived) {
              resolve({ success: false, error: 'Authentication cancelled' });
            }
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // COOP error or cross-origin - this is expected, continue checking
          // Don't log this as it's normal behavior
        }
      }, 1000);
    });
  }
};
