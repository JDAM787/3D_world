import crypto from 'node:crypto';
import { config, isProviderConfigured } from '../config/env.js';

/**
 * In-memory store for pending OAuth states to prevent CSRF and manage PKCE verifiers.
 * Map: state (string) -> { provider: string, codeVerifier?: string, expiresAt: number }
 */
const pendingOAuthStates = new Map();
const STATE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Prunes expired state tokens to avoid unbounded memory growth.
 */
function pruneExpiredStates() {
  const now = Date.now();
  for (const [state, data] of pendingOAuthStates.entries()) {
    if (data.expiresAt < now) {
      pendingOAuthStates.delete(state);
    }
  }
}

/**
 * Service to handle OAuth provider URLs, token exchange, PKCE, and profile normalization.
 * Uses native Node.js fetch and node:crypto without external SDKs.
 */
export class OAuthService {
  /**
   * Generates the authorization URL with dynamic state and PKCE S256 for X.
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {string} [customState]
   * @returns {string} authorization URL
   */
  getAuthorizationUrl(provider, customState) {
    pruneExpiredStates();

    // SEC-03: Generate a cryptographically strong random state
    const state = customState || crypto.randomBytes(32).toString('hex');
    let codeVerifier = null;
    let codeChallenge = null;

    if (provider === 'x') {
      // SEC-03: PKCE S256 generation using native crypto
      codeVerifier = crypto.randomBytes(32).toString('base64url');
      codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    }

    // Register state in memory with TTL
    pendingOAuthStates.set(state, {
      provider,
      codeVerifier,
      expiresAt: Date.now() + STATE_TTL_MS,
    });

    switch (provider) {
      case 'google': {
        const { clientId, callbackUrl } = config.oauth.google;
        const params = new URLSearchParams({
          client_id: clientId || 'dummy_google_client_id',
          redirect_uri: callbackUrl,
          response_type: 'code',
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent',
          state,
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      }

      case 'facebook': {
        const { appId, callbackUrl } = config.oauth.facebook;
        const params = new URLSearchParams({
          client_id: appId || 'dummy_facebook_app_id',
          redirect_uri: callbackUrl,
          response_type: 'code',
          scope: 'email,public_profile',
          state,
        });
        return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
      }

      case 'x': {
        const { clientId, callbackUrl } = config.oauth.x;
        const params = new URLSearchParams({
          client_id: clientId || 'dummy_twitter_client_id',
          redirect_uri: callbackUrl,
          response_type: 'code',
          scope: 'tweet.read users.read offline.access',
          state,
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
        });
        return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
      }

      default: {
        const error = new Error(`Unsupported OAuth provider: ${provider}`);
        error.statusCode = 400;
        throw error;
      }
    }
  }

  /**
   * Validates and single-use consumes the state parameter to protect against CSRF.
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {string} state
   * @param {string} code
   * @returns {{ provider: string, codeVerifier?: string }}
   */
  validateAndConsumeState(provider, state, code) {
    const isDev = config.nodeEnv !== 'production';

    // Allow omitting state in local dev when explicit mock code is provided
    if (isDev && code && code.startsWith('mock_')) {
      return { provider, codeVerifier: 'mock_code_verifier' };
    }

    if (!state) {
      const error = new Error('Missing OAuth state parameter (potential CSRF detected)');
      error.statusCode = 403;
      throw error;
    }

    pruneExpiredStates();

    const storedState = pendingOAuthStates.get(state);
    if (!storedState) {
      const error = new Error('Invalid or expired OAuth state parameter (potential CSRF detected)');
      error.statusCode = 403;
      throw error;
    }

    // Single-use consumption
    pendingOAuthStates.delete(state);

    if (storedState.provider !== provider) {
      const error = new Error('OAuth state provider mismatch');
      error.statusCode = 403;
      throw error;
    }

    if (storedState.expiresAt < Date.now()) {
      const error = new Error('Expired OAuth state parameter');
      error.statusCode = 403;
      throw error;
    }

    return storedState;
  }

  /**
   * Exchanges an authorization code for access tokens using native fetch.
   * Strictly forbids mock tokens in production (SEC-02).
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {string} code
   * @param {string} [codeVerifier]
   * @returns {Promise<string>} accessToken
   */
  async exchangeCodeForToken(provider, code, codeVerifier) {
    const isProd = config.nodeEnv === 'production';

    // SEC-02: Strict check against mock code injection in production
    if (isProd && code.startsWith('mock_')) {
      const error = new Error('Mock authorization codes are strictly forbidden in production');
      error.statusCode = 401;
      throw error;
    }

    // SEC-02: Reject if provider not configured in production
    if (isProd && !isProviderConfigured(provider)) {
      const error = new Error(`OAuth provider '${provider}' is not configured on this server`);
      error.statusCode = 503;
      throw error;
    }

    // Development/test mock fallback
    if (!isProd && (!isProviderConfigured(provider) || code.startsWith('mock_'))) {
      return `mock_access_token_${provider}_${Date.now()}`;
    }

    switch (provider) {
      case 'google': {
        const { clientId, clientSecret, callbackUrl } = config.oauth.google;
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: callbackUrl,
            grant_type: 'authorization_code',
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const error = new Error(errData.error_description || 'Failed to exchange Google OAuth code');
          error.statusCode = 401;
          throw error;
        }

        const data = await response.json();
        return data.access_token;
      }

      case 'facebook': {
        const { appId, appSecret, callbackUrl } = config.oauth.facebook;
        const params = new URLSearchParams({
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: callbackUrl,
          code,
        });

        const response = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const error = new Error(errData.error?.message || 'Failed to exchange Facebook OAuth code');
          error.statusCode = 401;
          throw error;
        }

        const data = await response.json();
        return data.access_token;
      }

      case 'x': {
        const { clientId, clientSecret, callbackUrl } = config.oauth.x;
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const response = await fetch('https://api.twitter.com/2/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuth}`,
          },
          body: new URLSearchParams({
            code,
            grant_type: 'authorization_code',
            redirect_uri: callbackUrl,
            code_verifier: codeVerifier || 'challenge',
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const error = new Error(errData.error_description || 'Failed to exchange X OAuth code');
          error.statusCode = 401;
          throw error;
        }

        const data = await response.json();
        return data.access_token;
      }

      default: {
        const error = new Error(`Unsupported OAuth provider: ${provider}`);
        error.statusCode = 400;
        throw error;
      }
    }
  }

  /**
   * Fetches user profile data from provider APIs using native fetch.
   * Strictly forbids mock tokens in production (SEC-02).
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {string} accessToken
   * @returns {Promise<object>} raw profile data
   */
  async fetchProfile(provider, accessToken) {
    const isProd = config.nodeEnv === 'production';

    if (accessToken.startsWith('mock_access_token_')) {
      if (isProd) {
        const error = new Error('Mock tokens are strictly forbidden in production');
        error.statusCode = 401;
        throw error;
      }
      return {
        id: `mock_${provider}_id_12345`,
        email: `mock.user.${provider}@example.com`,
        name: `Mock ${provider.toUpperCase()} User`,
        email_verified: true,
        picture: 'https://placehold.co/100x100?text=Mock',
      };
    }

    switch (provider) {
      case 'google': {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          const error = new Error('Failed to retrieve Google user profile');
          error.statusCode = 401;
          throw error;
        }

        return await response.json();
      }

      case 'facebook': {
        const response = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(accessToken)}`
        );

        if (!response.ok) {
          const error = new Error('Failed to retrieve Facebook user profile');
          error.statusCode = 401;
          throw error;
        }

        return await response.json();
      }

      case 'x': {
        const response = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          const error = new Error('Failed to retrieve X user profile');
          error.statusCode = 401;
          throw error;
        }

        const data = await response.json();
        return data.data || data;
      }

      default: {
        const error = new Error(`Unsupported OAuth provider: ${provider}`);
        error.statusCode = 400;
        throw error;
      }
    }
  }

  /**
   * Normalizes raw provider profile data into a consistent domain model.
   * Includes emailVerified for Account Takeover mitigation (SEC-05).
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {object} rawProfile
   * @returns {{ email: string, name: string, provider: string, providerId: string, avatar: string | null, emailVerified: boolean }}
   */
  normalizeProfile(provider, rawProfile) {
    if (!rawProfile) {
      const error = new Error('Invalid profile data received from OAuth provider');
      error.statusCode = 400;
      throw error;
    }

    switch (provider) {
      case 'google':
        return {
          email: rawProfile.email || '',
          name: rawProfile.name || 'Google User',
          provider: 'google',
          providerId: String(rawProfile.id || rawProfile.sub),
          avatar: rawProfile.picture || null,
          // SEC-05: Check explicit verified email flag from Google
          emailVerified: Boolean(rawProfile.email_verified ?? rawProfile.verified_email ?? true),
        };

      case 'facebook':
        return {
          email: rawProfile.email || `${rawProfile.id}@facebook.placeholder.com`,
          name: rawProfile.name || 'Facebook User',
          provider: 'facebook',
          providerId: String(rawProfile.id),
          avatar: rawProfile.picture?.data?.url || null,
          // SEC-05: Facebook only verifies if explicit verified property or custom check is present
          emailVerified: Boolean(rawProfile.email && rawProfile.verified),
        };

      case 'x':
        return {
          email: rawProfile.email || `${rawProfile.username || rawProfile.id}@x.placeholder.com`,
          name: rawProfile.name || rawProfile.username || 'X User',
          provider: 'x',
          providerId: String(rawProfile.id),
          avatar: rawProfile.profile_image_url || null,
          // SEC-05: X v2 API does not verify third-party email addresses in user info
          emailVerified: false,
        };

      default: {
        const error = new Error(`Unsupported OAuth provider: ${provider}`);
        error.statusCode = 400;
        throw error;
      }
    }
  }

  /**
   * Full OAuth callback processing pipeline:
   * 1. Validate & consume state (anti-CSRF)
   * 2. Exchange code for access token with PKCE
   * 3. Fetch raw profile
   * 4. Normalize to domain model
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {string} code
   * @param {string} [state]
   * @returns {Promise<{ email: string, name: string, provider: string, providerId: string, avatar: string | null, emailVerified: boolean }>}
   */
  async handleOAuthCallback(provider, code, state) {
    if (!code) {
      const error = new Error('Authorization code is missing from OAuth callback');
      error.statusCode = 400;
      throw error;
    }

    // SEC-03: Validate and consume state token (retrieves PKCE codeVerifier)
    const { codeVerifier } = this.validateAndConsumeState(provider, state, code);

    const token = await this.exchangeCodeForToken(provider, code, codeVerifier);
    const rawProfile = await this.fetchProfile(provider, token);
    return this.normalizeProfile(provider, rawProfile);
  }

  /**
   * Helper to retrieve count of active pending states (for testing/monitoring).
   * @returns {number}
   */
  getPendingStatesCount() {
    return pendingOAuthStates.size;
  }

  /**
   * Helper to clear states (for testing).
   */
  clearPendingStates() {
    pendingOAuthStates.clear();
  }
}

export const oauthService = new OAuthService();
export default oauthService;
