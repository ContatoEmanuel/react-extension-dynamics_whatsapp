/**
 * Gerenciador de autenticação OAuth 2.0 com Azure AD
 * Implementa o fluxo de autorização para extensões Chrome
 */

import { azureConfig } from '../lib/azure/config'

interface AuthConfig {
  clientId: string
  tenantId: string
  redirectUri: string
}

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope: string
}

interface StoredAuth {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  scope: string
}

export class AuthManager {
  private codeVerifier: string = ''
  
  constructor(private config: AuthConfig) {}
  
  /**
   * Gera um code verifier aleatório para PKCE
   */
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return this.base64UrlEncode(array)
  }
  
  /**
   * Gera o code challenge a partir do verifier usando SHA-256
   */
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(verifier)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return this.base64UrlEncode(new Uint8Array(hash))
  }
  
  /**
   * Converte array de bytes para base64url (sem padding)
   */
  private base64UrlEncode(buffer: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...buffer))
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  /**
   * Inicia o fluxo de autenticação OAuth 2.0 com PKCE
   */
  async login(): Promise<string> {
    try {
      console.log('🔐 [Auth] Iniciando fluxo de autenticação OAuth 2.0 com PKCE...')
      
      // Gera code verifier e challenge para PKCE
      this.codeVerifier = this.generateCodeVerifier()
      const codeChallenge = await this.generateCodeChallenge(this.codeVerifier)
      console.log('🔑 [Auth] PKCE code verifier gerado')
      
      // Gera URL de autorização com PKCE
      const authUrl = await this.buildAuthUrl(codeChallenge)
      console.log('🔗 [Auth] URL de autorização:', authUrl)
      
      // Abre popup de autenticação usando Chrome Identity API
      const redirectUrl = await chrome.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true,
      })
      
      console.log('✅ [Auth] Redirect recebido:', redirectUrl)
      
      if (!redirectUrl) {
        throw new Error('Nenhuma URL de redirect recebida')
      }
      
      // Extrai o código de autorização da URL de callback
      const code = this.extractAuthCode(redirectUrl)
      
      if (!code) {
        throw new Error('Código de autorização não encontrado na resposta')
      }
      
      // Troca o código por um access token (com code verifier)
      const tokenResponse = await this.exchangeCodeForToken(code)
      
      // Salva os tokens no storage
      await this.saveTokens(tokenResponse)
      
      console.log('✅ [Auth] Autenticação concluída com sucesso!')
      return tokenResponse.access_token
      
    } catch (error) {
      console.error('❌ [Auth] Erro na autenticação:', error)
      throw error
    }
  }

  /**
   * Constrói a URL de autorização OAuth 2.0 com PKCE
   */
  private async buildAuthUrl(codeChallenge: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      scope: azureConfig.scopes.join(' '),
      response_mode: 'query',
      prompt: 'select_account',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    })
    
    return `${azureConfig.endpoints.authorize}?${params.toString()}`
  }

  /**
   * Extrai o código de autorização da URL de redirect
   */
  private extractAuthCode(url: string): string | null {
    const urlObj = new URL(url)
    
    // Log completo da URL de redirect para debug
    console.log('🔍 [Auth] URL completa de redirect:', url)
    console.log('🔍 [Auth] Search params:', urlObj.searchParams.toString())
    
    // Verifica se há erro na resposta
    const error = urlObj.searchParams.get('error')
    const errorDescription = urlObj.searchParams.get('error_description')
    
    if (error) {
      console.error('❌ [Auth] Erro do Azure AD:', error)
      console.error('❌ [Auth] Descrição:', errorDescription)
      throw new Error(`Erro do Azure AD: ${error} - ${errorDescription || 'Sem descrição'}`)
    }
    
    // Tenta obter o código de autorização
    const code = urlObj.searchParams.get('code')
    
    if (!code) {
      console.error('❌ [Auth] Nenhum código encontrado. Params disponíveis:', 
        Array.from(urlObj.searchParams.keys()))
    }
    
    return code
  }

  /**
   * Troca o código de autorização por um access token (com PKCE)
   */
  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      code: code,
      redirect_uri: this.config.redirectUri,
      grant_type: 'authorization_code',
      code_verifier: this.codeVerifier, // PKCE: envia o code verifier
    })
    
    console.log('🔄 [Auth] Trocando código por token com PKCE...')
    
    const response = await fetch(azureConfig.endpoints.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('❌ [Auth] Erro na resposta do token:', error)
      throw new Error(`Erro ao trocar código por token: ${error}`)
    }
    
    return await response.json()
  }

  /**
   * Salva os tokens no Chrome Storage
   */
  private async saveTokens(tokenResponse: TokenResponse): Promise<void> {
    const expiresAt = Date.now() + (tokenResponse.expires_in * 1000)
    
    const authData: StoredAuth = {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt,
      scope: tokenResponse.scope,
    }
    
    await chrome.storage.local.set({ auth: authData })
    console.log('💾 [Auth] Tokens salvos no storage')
  }

  /**
   * Obtém o token de acesso atual (com refresh automático se necessário)
   */
  async getAuthToken(): Promise<string | null> {
    try {
      const result = await chrome.storage.local.get('auth')
      const auth: StoredAuth | undefined = result.auth
      
      if (!auth) {
        console.log('⚠️ [Auth] Nenhum token encontrado')
        return null
      }
      
      // Verifica se o token expirou
      if (this.isTokenExpired(auth.expiresAt)) {
        console.log('🔄 [Auth] Token expirado, renovando...')
        
        if (auth.refreshToken) {
          return await this.refreshToken(auth.refreshToken)
        } else {
          console.log('⚠️ [Auth] Sem refresh token disponível, necessário novo login')
          return null
        }
      }
      
      return auth.accessToken
      
    } catch (error) {
      console.error('❌ [Auth] Erro ao obter token:', error)
      return null
    }
  }

  /**
   * Verifica se o token está expirado (com margem de 5 minutos)
   */
  private isTokenExpired(expiresAt: number): boolean {
    const margin = 5 * 60 * 1000 // 5 minutos
    return Date.now() >= (expiresAt - margin)
  }

  /**
   * Renova o token usando o refresh token
   */
  private async refreshToken(refreshToken: string): Promise<string> {
    try {
      const params = new URLSearchParams({
        client_id: this.config.clientId,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: azureConfig.scopes.join(' '),
      })
      
      const response = await fetch(azureConfig.endpoints.token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao renovar token')
      }
      
      const tokenResponse: TokenResponse = await response.json()
      await this.saveTokens(tokenResponse)
      
      console.log('✅ [Auth] Token renovado com sucesso')
      return tokenResponse.access_token
      
    } catch (error) {
      console.error('❌ [Auth] Erro ao renovar token:', error)
      throw error
    }
  }

  /**
   * Remove todos os tokens (logout)
   */
  async clearAuth(): Promise<void> {
    await chrome.storage.local.remove('auth')
    console.log('🚪 [Auth] Tokens removidos - usuário deslogado')
  }

  /**
   * Obtém informações do usuário autenticado
   */
  async getUserInfo(): Promise<any> {
    const token = await this.getAuthToken()
    
    if (!token) {
      throw new Error('Usuário não autenticado')
    }
    
    const response = await fetch(azureConfig.endpoints.userInfo, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Erro ao buscar informações do usuário')
    }
    
    return await response.json()
  }
}

