// Spotify OAuth 2.0 PKCE Service

export const REGISTERED_REDIRECT_URI = 'https://pixelmusic.vercel.app/callback';

export const STORAGE_KEYS = {
  CLIENT_ID: 'roomtone_spotify_client_id',
  ACCESS_TOKEN: 'roomtone_spotify_access_token',
  REFRESH_TOKEN: 'roomtone_spotify_refresh_token',
  EXPIRES_AT: 'roomtone_spotify_expires_at',
  CODE_VERIFIER: 'roomtone_spotify_code_verifier',
  AUTH_STATE: 'roomtone_spotify_auth_state',
  USED_REDIRECT_URI: 'roomtone_spotify_used_redirect_uri',
  CUSTOM_REDIRECT_URI: 'roomtone_spotify_custom_redirect_uri',
  SHOW_PROFILE_IN_ROOM: 'roomtone_spotify_show_profile_in_room',
};

// Spotify developer policy compliant scopes:
// Minimal required permissions to visualize currently playing track, artwork, and playback status
export const SPOTIFY_SCOPES = [
  'user-read-playback-state',
  'user-read-currently-playing',
  'user-read-private',
  'user-modify-playback-state',
].join(' ');

function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values).map((x) => possible[x % possible.length]).join('');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function getStoredClientId(): string {
  const envId = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SPOTIFY_CLIENT_ID;
  return localStorage.getItem(STORAGE_KEYS.CLIENT_ID) || envId || '';
}

export function setStoredClientId(clientId: string): void {
  localStorage.setItem(STORAGE_KEYS.CLIENT_ID, clientId.trim());
}

export function getRedirectUri(): string {
  // 1. Environment variable if set
  const envUri = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SPOTIFY_REDIRECT_URI;
  if (envUri && envUri.trim()) return envUri.trim();

  // 2. Custom override from local storage if set
  const customUri = localStorage.getItem(STORAGE_KEYS.CUSTOM_REDIRECT_URI);
  if (customUri && customUri.trim()) return customUri.trim();

  // 3. Official registered redirect URI as requested
  return REGISTERED_REDIRECT_URI;
}

export function setCustomRedirectUri(uri: string): void {
  if (uri && uri.trim() && uri.trim() !== REGISTERED_REDIRECT_URI) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_REDIRECT_URI, uri.trim());
  } else {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_REDIRECT_URI);
  }
}

export function getShowProfileInRoom(): boolean {
  return localStorage.getItem(STORAGE_KEYS.SHOW_PROFILE_IN_ROOM) !== 'false';
}

export function setShowProfileInRoom(val: boolean): void {
  localStorage.setItem(STORAGE_KEYS.SHOW_PROFILE_IN_ROOM, val ? 'true' : 'false');
}

export async function initiateSpotifyLogin(clientIdParam?: string, redirectUriParam?: string): Promise<void> {
  const clientId = clientIdParam || getStoredClientId();
  if (!clientId) throw new Error('Spotify Client ID is required');

  setStoredClientId(clientId);

  const redirectUri = redirectUriParam || getRedirectUri();
  const verifier = generateRandomString(64);
  const challenge = await generateCodeChallenge(verifier);
  const state = generateRandomString(16);

  localStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, verifier);
  localStorage.setItem(STORAGE_KEYS.AUTH_STATE, state);
  localStorage.setItem(STORAGE_KEYS.USED_REDIRECT_URI, redirectUri);

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', SPOTIFY_SCOPES);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('code_challenge', challenge);
  authUrl.searchParams.set('state', state);

  window.location.href = authUrl.toString();
}

export async function handleSpotifyCallback(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  const code = urlParams.get('code') || hashParams.get('code');
  const state = urlParams.get('state') || hashParams.get('state');
  const error = urlParams.get('error') || hashParams.get('error');

  if (error) {
    cleanCallbackUrl();
    throw new Error(`Spotify authorization denied: ${error}`);
  }

  if (!code) return false;

  const storedState = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
  if (!state || state !== storedState) {
    cleanCallbackUrl();
    throw new Error('Invalid OAuth state. Potential CSRF security check failed.');
  }

  const verifier = localStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);
  const clientId = getStoredClientId();
  const redirectUri = localStorage.getItem(STORAGE_KEYS.USED_REDIRECT_URI) || getRedirectUri();

  if (!verifier || !clientId) {
    cleanCallbackUrl();
    throw new Error('Missing code verifier or client ID for token exchange');
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error_description || `Failed to exchange code: HTTP ${response.status}`);
    }

    const data = await response.json();
    saveTokens(data.access_token, data.refresh_token, data.expires_in);

    localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    localStorage.removeItem(STORAGE_KEYS.USED_REDIRECT_URI);

    cleanCallbackUrl();
    return true;
  } catch (err) {
    cleanCallbackUrl();
    throw err;
  }
}

function cleanCallbackUrl(): void {
  if (typeof window === 'undefined') return;
  // If we arrived at /callback, clean back to base /
  const cleanPath = window.location.pathname.endsWith('/callback') ? '/' : window.location.pathname;
  window.history.replaceState({}, document.title, cleanPath);
}

function saveTokens(accessToken: string, refreshToken?: string, expiresIn = 3600): void {
  const expiresAt = Date.now() + (expiresIn - 60) * 1000;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  const clientId = getStoredClientId();
  if (!refreshToken || !clientId) {
    logoutSpotify();
    return null;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      logoutSpotify();
      return null;
    }

    const data = await response.json();
    saveTokens(data.access_token, data.refresh_token || refreshToken, data.expires_in);
    return data.access_token;
  } catch {
    logoutSpotify();
    return null;
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const expiresAtStr = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
  if (!token || !expiresAtStr) return null;

  if (Date.now() >= parseInt(expiresAtStr, 10)) {
    return await refreshAccessToken();
  }
  return token;
}

export function isSpotifyAuthenticated(): boolean {
  return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function logoutSpotify(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
  localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
  localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
  localStorage.removeItem(STORAGE_KEYS.USED_REDIRECT_URI);
}
