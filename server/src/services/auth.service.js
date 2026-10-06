import crypto from 'crypto';
import { oauthService } from './oauth.service.js';

/**
 * In-memory user store for mock persistence before an ORM/database is integrated.
 * Key: userId (string) -> Value: User object
 */
const usersStore = new Map();

export class AuthService {
  /**
   * Finds an existing user by OAuth provider identity or email, or creates a new one.
   * @param {{ email: string, name: string, provider: string, providerId: string, avatar?: string | null }} profile
   * @returns {object} user
   */
  findOrCreateUser(profile) {
    const { email, name, provider, providerId, avatar } = profile;

    // 1. Search by provider and providerId
    let existingUser = null;
    for (const user of usersStore.values()) {
      if (user.provider === provider && user.providerId === providerId) {
        existingUser = user;
        break;
      }
    }

    // 2. Search by email if not found by provider ID
    if (!existingUser && email) {
      for (const user of usersStore.values()) {
        if (user.email.toLowerCase() === email.toLowerCase()) {
          existingUser = user;
          // Link new provider information to the user
          existingUser.provider = provider;
          existingUser.providerId = providerId;
          existingUser.updatedAt = new Date().toISOString();
          break;
        }
      }
    }

    if (existingUser) {
      return existingUser;
    }

    // 3. Create a new user
    const newUser = {
      id: crypto.randomUUID(),
      email: email || '',
      name: name || 'User',
      provider,
      providerId,
      avatar: avatar || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersStore.set(newUser.id, newUser);
    return newUser;
  }

  /**
   * Generates a session token for the authenticated user.
   * Uses standard crypto without external JWT dependencies.
   * @param {object} user
   * @returns {string} token
   */
  generateAuthToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      provider: user.provider,
      timestamp: Date.now(),
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64url');
  }

  /**
   * Handles complete OAuth authentication flow.
   * @param {'google' | 'facebook' | 'x'} provider
   * @param {string} code
   * @returns {Promise<{ token: string, user: object }>}
   */
  async authenticateWithOAuth(provider, code) {
    const normalizedProfile = await oauthService.handleOAuthCallback(provider, code);
    const user = this.findOrCreateUser(normalizedProfile);
    const token = this.generateAuthToken(user);

    return { token, user };
  }

  /**
   * Helper to retrieve all in-memory users (for testing/inspection).
   * @returns {object[]}
   */
  getAllUsers() {
    return Array.from(usersStore.values());
  }

  /**
   * Clears the in-memory user store (useful for tests).
   */
  clearUsers() {
    usersStore.clear();
  }
}

export const authService = new AuthService();
export default authService;
