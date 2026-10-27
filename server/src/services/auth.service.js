import crypto from 'node:crypto';
import { config } from '../config/env.js';
import { oauthService } from './oauth.service.js';

/**
 * In-memory user store with safety capacity to mitigate DoS (SEC-07).
 * Key: userId (string) -> Value: User object
 */
const usersStore = new Map();
const MAX_USERS_CAPACITY = 1000;

/**
 * Enforces bounded memory on the in-memory store using FIFO eviction.
 */
function enforceStoreCapacity() {
  if (usersStore.size >= MAX_USERS_CAPACITY) {
    const oldestKey = usersStore.keys().next().value;
    if (oldestKey) {
      usersStore.delete(oldestKey);
    }
  }
}

export class AuthService {
  /**
   * Finds an existing user by OAuth provider identity or verified email, or creates a new one.
   * Mitigates Account Takeover by checking emailVerified (SEC-05).
   * @param {{ email: string, name: string, provider: string, providerId: string, avatar?: string | null, emailVerified?: boolean }} profile
   * @returns {object} user
   */
  findOrCreateUser(profile) {
    const { email, name, provider, providerId, avatar, emailVerified } = profile;

    // 1. Search by existing provider identity in linked providers or primary provider
    let existingUser = null;
    for (const user of usersStore.values()) {
      const isMatch = (user.provider === provider && user.providerId === providerId) ||
        (Array.isArray(user.providers) && user.providers.some(p => p.provider === provider && p.providerId === providerId));
      if (isMatch) {
        existingUser = user;
        break;
      }
    }

    // 2. SEC-05: Only link by email match if email is explicitly verified
    if (!existingUser && email) {
      for (const user of usersStore.values()) {
        if (user.email.toLowerCase() === email.toLowerCase()) {
          if (emailVerified === true) {
            existingUser = user;
            // Ensure providers list exists
            if (!Array.isArray(existingUser.providers)) {
              existingUser.providers = [
                { provider: existingUser.provider, providerId: existingUser.providerId, linkedAt: existingUser.createdAt }
              ];
            }
            // Add provider without destructively overwriting primary provider
            const alreadyLinked = existingUser.providers.some(p => p.provider === provider && p.providerId === providerId);
            if (!alreadyLinked) {
              existingUser.providers.push({
                provider,
                providerId,
                linkedAt: new Date().toISOString(),
              });
            }
            existingUser.updatedAt = new Date().toISOString();
          }
          break;
        }
      }
    }

    if (existingUser) {
      return existingUser;
    }

    // 3. Create a new user with bounded capacity enforcement
    enforceStoreCapacity();

    const newUser = {
      id: crypto.randomUUID(),
      email: email || '',
      name: name || 'User',
      provider,
      providerId,
      avatar: avatar || null,
      providers: [
        { provider, providerId, linkedAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersStore.set(newUser.id, newUser);
    return newUser;
  }

  /**
   * Generates an HMAC-SHA256 signed session token with 24h expiration (SEC-01).
   * Format: ${base64urlPayload}.${base64urlSignature}
   * @param {object} user
   * @returns {string} signedToken
   */
  generateAuthToken(user) {
    const now = Date.now();
    const payload = {
      userId: user.id,
      email: user.email,
      provider: user.provider,
      timestamp: now,
      exp: now + 24 * 60 * 60 * 1000, // 24 hours
    };

    const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', config.authSecret)
      .update(data)
      .digest('base64url');

    return `${data}.${signature}`;
  }

  /**
   * Verifies an HMAC-SHA256 signed session token using timing-safe comparison (SEC-01).
   * @param {string} token
   * @returns {object} decodedPayload
   */
  verifyAuthToken(token) {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      const error = new Error('Malformed or missing authentication token');
      error.statusCode = 401;
      throw error;
    }

    const [data, signature] = token.split('.');
    if (!data || !signature) {
      const error = new Error('Invalid token structure');
      error.statusCode = 401;
      throw error;
    }

    const expectedSignature = crypto
      .createHmac('sha256', config.authSecret)
      .update(data)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);

    // Timing-safe comparison to prevent side-channel timing attacks
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      const error = new Error('Invalid token signature (token tampering detected)');
      error.statusCode = 401;
      throw error;
    }

    let payload;
    try {
      payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    } catch {
      const error = new Error('Corrupted token payload');
      error.statusCode = 401;
      throw error;
    }

    if (payload.exp && Date.now() > payload.exp) {
      const error = new Error('Token has expired');
      error.statusCode = 401;
      throw error;
    }

    return payload;
  }

  /**
   * Handles complete OAuth authentication flow with state verification.
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {string} code
   * @param {string} [state]
   * @returns {Promise<{ token: string, user: object }>}
   */
  async authenticateWithOAuth(provider, code, state) {
    const normalizedProfile = await oauthService.handleOAuthCallback(provider, code, state);
    const user = this.findOrCreateUser(normalizedProfile);
    const token = this.generateAuthToken(user);

    return { token, user };
  }

  /**
   * Helper to retrieve all in-memory users.
   * @returns {object[]}
   */
  getAllUsers() {
    return Array.from(usersStore.values());
  }

  /**
   * Clears the in-memory user store.
   */
  clearUsers() {
    usersStore.clear();
  }
}

export const authService = new AuthService();
export const verifyAuthToken = authService.verifyAuthToken.bind(authService);
export default authService;
