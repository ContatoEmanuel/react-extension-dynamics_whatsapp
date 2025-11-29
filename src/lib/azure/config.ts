/**
 * Configurações do Azure AD (Entra ID) para OAuth 2.0
 */

// Função helper para remover barra final de URLs
const removeTrailingSlash = (url: string): string => {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

const dynamicsResource = removeTrailingSlash(import.meta.env.VITE_DYNAMICS_RESOURCE || '')

export const azureConfig = {
  clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
  tenantId: import.meta.env.VITE_AZURE_TENANT_ID || 'common',
  redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || chrome.identity.getRedirectURL('auth/callback'),
  authority: import.meta.env.VITE_AZURE_AUTHORITY || 'https://login.microsoftonline.com/common',
  
  // Dynamics 365 scopes
  scopes: [
    dynamicsResource ? `${dynamicsResource}/user_impersonation` : '',
    'openid',
    'profile',
    'email',
    'User.Read'
  ].filter(s => s !== ''), // Remove scopes vazios
  
  // Endpoints
  endpoints: {
    authorize: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    token: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfo: 'https://graph.microsoft.com/v1.0/me'
  }
}

/**
 * Configurações do Dynamics 365
 */
export const dynamicsConfig = {
  baseUrl: removeTrailingSlash(import.meta.env.VITE_DYNAMICS_URL || ''),
  apiVersion: import.meta.env.VITE_DYNAMICS_API_VERSION || '9.2',
  resource: dynamicsResource,
}

/**
 * Valida se as configurações essenciais estão definidas
 * Em desenvolvimento, apenas avisa. Em produção, bloqueia.
 */
export function validateConfig(): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  const isProduction = import.meta.env.VITE_ENV === 'production'
  
  // Validações críticas - verifica se tem valor e não é string vazia
  if (!azureConfig.clientId || azureConfig.clientId.trim() === '') {
    const msg = 'VITE_AZURE_CLIENT_ID não está configurado'
    if (isProduction) {
      errors.push(msg)
    } else {
      warnings.push(msg + ' (OK em desenvolvimento)')
    }
  }
  
  if (!dynamicsConfig.baseUrl || dynamicsConfig.baseUrl.trim() === '') {
    const msg = 'VITE_DYNAMICS_URL não está configurado'
    if (isProduction) {
      errors.push(msg)
    } else {
      warnings.push(msg + ' (OK em desenvolvimento)')
    }
  }
  
  if (!dynamicsConfig.resource || dynamicsConfig.resource.trim() === '') {
    const msg = 'VITE_DYNAMICS_RESOURCE não está configurado'
    if (isProduction) {
      errors.push(msg)
    } else {
      warnings.push(msg + ' (OK em desenvolvimento)')
    }
  }
  
  // Log das configurações carregadas (apenas em desenvolvimento)
  if (!isProduction) {
    console.log('📋 [Config] Configurações carregadas:', {
      clientId: azureConfig.clientId ? '✅ Configurado' : '❌ Vazio',
      tenantId: azureConfig.tenantId ? '✅ Configurado' : '❌ Vazio',
      dynamicsUrl: dynamicsConfig.baseUrl ? '✅ Configurado' : '❌ Vazio',
      dynamicsResource: dynamicsConfig.resource ? '✅ Configurado' : '❌ Vazio'
    })
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
