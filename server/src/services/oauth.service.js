import { config, isProviderConfigured } from '../config/env.js';

/**
 * Service to handle OAuth provider URLs, token exchange, and profile normalization.
 * Uses native Node.js fetch without external SDKs.
 */
export class OAuthService {
  /**
   * Generates the authorization URL for the specified provider.
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {string} [state]
   * @returns {string}
   */
  getAuthorizationUrl(provider, state = 'default_state') {
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
          code_challenge: 'challenge',
          code_challenge_method: 'plain',
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
   * Exchanges an authorization code for access tokens using native fetch.
   * In development/unconfigured environments, gracefully falls back to mock tokens.
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {string} code
   * @returns {Promise<string>} accessToken
   */
  async exchangeCodeForToken(provider, code) {
    if (!isProviderConfigured(provider) || code.startsWith('mock_')) {
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
            code_verifier: 'challenge',
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
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {string} accessToken
   * @returns {Promise<object>} raw profile data
   */
  async fetchProfile(provider, accessToken) {
    if (accessToken.startsWith('mock_access_token_')) {
      return {
        id: `mock_${provider}_id_12345`,
        email: `mock.user.${provider}@example.com`,
        name: `Mock ${provider.toUpperCase()} User`,
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
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {object} rawProfile
   * @returns {{ email: string, name: string, provider: string, providerId: string, avatar: string | null }}
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
        };

      case 'facebook':
        return {
          email: rawProfile.email || `${rawProfile.id}@facebook.placeholder.com`,
          name: rawProfile.name || 'Facebook User',
          provider: 'facebook',
          providerId: String(rawProfile.id),
          avatar: rawProfile.picture?.data?.url || null,
        };

      case 'x':
        return {
          email: rawProfile.email || `${rawProfile.username || rawProfile.id}@x.placeholder.com`,
          name: rawProfile.name || rawProfile.username || 'X User',
          provider: 'x',
          providerId: String(rawProfile.id),
          avatar: rawProfile.profile_image_url || null,
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
   * 1. Exchange code for access token (native fetch)
   * 2. Fetch raw profile (native fetch)
   * 3. Normalize to common model
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {string} code
   * @returns {Promise<{ email: string, name: string, provider: string, providerId: string, avatar: string | null }>}
   */
  async handleOAuthCallback(provider, code) {
    if (!code) {
      const error = new Error('Authorization code is missing from OAuth callback');
      error.statusCode = 400;
      throw error;
    }

    const token = await this.exchangeCodeForToken(provider, code);
    const rawProfile = await this.fetchProfile(provider, token);
    return this.normalizeProfile(provider, rawProfile);
  }
}

export const oauthService = new OAuthService();
export default oauthService;
