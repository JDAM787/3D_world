import { config } from '../config/env.js';
import { oauthService } from '../services/oauth.service.js';
import { authService } from '../services/auth.service.js';

const ALLOWED_PROVIDERS = ['google', 'facebook', 'x'];

export class AuthController {
  /**
   * Redirects the user to the specified OAuth provider's authorization screen.
   */
  redirectToProvider = (req, res, next) => {
    try {
      const provider = req.params.provider?.toLowerCase();

      if (!ALLOWED_PROVIDERS.includes(provider)) {
        const error = new Error(`Invalid OAuth provider: ${provider}`);
        error.statusCode = 400;
        return next(error);
      }

      const authUrl = oauthService.getAuthorizationUrl(provider, req.query.state);
      return res.redirect(authUrl);
    } catch (err) {
      return next(err);
    }
  };

  /**
   * Handles the OAuth callback from the provider.
   * On success: Redirects to the frontend with token, or responds with JSON if requested via API.
   * On failure: Redirects to frontend login with error flag, or delegates to errorHandler.
   */
  handleCallback = async (req, res, next) => {
    const isApiRequest = req.headers.accept?.includes('application/json');

    try {
      const provider = req.params.provider?.toLowerCase();

      if (!ALLOWED_PROVIDERS.includes(provider)) {
        const error = new Error(`Invalid OAuth provider: ${provider}`);
        error.statusCode = 400;
        return next(error);
      }

      // Check for provider error query params (e.g. user cancelled consent)
      if (req.query.error) {
        if (isApiRequest) {
          const error = new Error(req.query.error_description || req.query.error || 'Authentication rejected');
          error.statusCode = 401;
          return next(error);
        }
        return res.redirect(`${config.clientUrl}/login?error=auth_failed`);
      }

      const code = req.query.code;
      if (!code) {
        if (isApiRequest) {
          const error = new Error('Authorization code missing from callback');
          error.statusCode = 400;
          return next(error);
        }
        return res.redirect(`${config.clientUrl}/login?error=auth_failed`);
      }

      // Authenticate and find/create user via service layer
      const { token, user } = await authService.authenticateWithOAuth(provider, code);

      // If requested as API response (e.g. mobile app or automated testing)
      if (isApiRequest) {
        return res.status(200).json({
          success: true,
          data: { token, user },
        });
      }

      // Standard browser callback redirection to frontend with auth token
      const redirectUrl = new URL(config.clientUrl);
      redirectUrl.searchParams.set('token', token);
      redirectUrl.searchParams.set('provider', provider);

      return res.redirect(redirectUrl.toString());
    } catch (err) {
      if (isApiRequest) {
        return next(err);
      }
      return res.redirect(`${config.clientUrl}/login?error=auth_failed`);
    }
  };
}

export const authController = new AuthController();
export default authController;
