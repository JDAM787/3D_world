import dotenv from 'dotenv';

dotenv.config();

const callbackBase = process.env.CALLBACK_URL_BASE || 'http://localhost:5000/api/auth';

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
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

export default config;
