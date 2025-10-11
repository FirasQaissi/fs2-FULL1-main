import { authStorage } from './authStorage';

export async function http<TResponse>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<TResponse> {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as Record<string, string>;

  const res = await fetch(input, { headers, ...init });
  
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch (e) {
      // Error parsing JSON response
    }
    
    // Handle token expiration (skip if this is the refresh call or refresh in progress)
    const isRefreshCall = input.toString().includes('/api/auth/refresh');
    const isRefreshing = (window as unknown as { __refreshingToken?: boolean }).__refreshingToken === true;
    if (res.status === 401 && (message.includes('token') || message.includes('Unauthorized')) && !isRefreshCall && !isRefreshing) {
      window.dispatchEvent(new CustomEvent('tokenExpired', {
        detail: { status: res.status, message }
      }));
    }
    
    throw new Error(message);
  }
  
  const result = await res.json();
  return result as TResponse;
}

// ✅ Use the CORRECT backend URL (smartgate-qea6.onrender.com)
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://smartgate-qea6.onrender.com';


