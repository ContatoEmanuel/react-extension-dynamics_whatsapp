/**
 * Lógica de autenticação e refresh de tokens
 */

interface AuthConfig {
  clientId: string;
  tenantId: string;
  redirectUri: string;
}

export class AuthManager {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async getAuthToken(): Promise<string | null> {
    try {
      const stored = await chrome.storage.local.get('authToken');
      
      if (stored.authToken && !this.isTokenExpired(stored.tokenExpiry)) {
        return stored.authToken;
      }

      // Token expirado ou não existe, faz refresh
      return await this.refreshToken();
    } catch (error) {
      console.error('❌ Erro ao obter token:', error);
      return null;
    }
  }

  private isTokenExpired(expiry: number): boolean {
    if (!expiry) return true;
    return Date.now() >= expiry;
  }

  private async refreshToken(): Promise<string | null> {
    // TODO: Implementar lógica de OAuth 2.0 com Azure AD
    console.log('🔄 Refreshing token...');
    return null;
  }

  async clearAuth(): Promise<void> {
    await chrome.storage.local.remove(['authToken', 'tokenExpiry', 'refreshToken']);
  }
}
