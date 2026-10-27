import dotenv from 'dotenv';

dotenv.config();

const callbackBase = process.env.CALLBACK_URL_BASE || 'http://localhost:5000/api/auth';

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  authSecret: process.env.AUTH_SECRET || 'dev_fallback_secret_change_in_prod',
  callbackUrlBase: callbackBase,
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: `${callbackBase}/google/callback`,
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID || '',
      appSecret: process.env.FACEBOOK_APP_SECRET || '',
      callbackUrl: `${callbackBase}/facebook/callback`,
    },
    x: {
      clientId: process.env.TWITTER_CLIENT_ID || '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
      callbackUrl: `${callbackBase}/x/callback`,
    },
  },
};

/**
 * Checks if a given OAuth provider has credentials configured.
 * @param {'google' | 'facebook' | 'x'} provider
 * @returns {boolean}
 */
export function isProviderConfigured(provider) {
  const providerConfig = config.oauth[provider];
  if (!providerConfig) return false;

  if (provider === 'google') {
    return Boolean(providerConfig.clientId && providerConfig.clientSecret);
  }
  if (provider === 'facebook') {
    return Boolean(providerConfig.appId && providerConfig.appSecret);
  }
  if (provider === 'x') {
    return Boolean(providerConfig.clientId && providerConfig.clientSecret);
  }
  return false;
}

/**
 * Validates critical environment configuration, enforcing security constraints in production.
 */
export function validateEnvironment() {
  if (config.nodeEnv === 'production') {
    const missing = [];
    if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET === 'dev_fallback_secret_change_in_prod') {
      missing.push('AUTH_SECRET (must be defined and secure in production)');
    }
    if (!process.env.CLIENT_URL) {
      missing.push('CLIENT_URL');
    }
    if (missing.length > 0) {
      throw new Error(`[Security Error] Insecure or missing environment configuration in production: ${missing.join(', ')}`);
    }
  }
}

export default config;
