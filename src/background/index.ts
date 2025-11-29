import { AuthManager } from './auth'
import { azureConfig, validateConfig } from '../lib/azure/config'

console.log('🚀 [Dynamics Extension] Background Service Worker iniciado')

// Valida configurações ao iniciar
const configValidation = validateConfig()
if (!configValidation.valid) {
  console.error('❌ [Config] Erros de configuração:', configValidation.errors)
}
if (configValidation.warnings && configValidation.warnings.length > 0) {
  console.warn('⚠️ [Config] Avisos de configuração:', configValidation.warnings)
}

// Inicializa gerenciador de autenticação
const authManager = new AuthManager({
  clientId: azureConfig.clientId,
  tenantId: azureConfig.tenantId,
  redirectUri: azureConfig.redirectUri,
})

// Listener para instalação da extensão
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('✅ [Dynamics Extension] Extensão instalada pela primeira vez')
  } else if (details.reason === 'update') {
    console.log('🔄 [Dynamics Extension] Extensão atualizada')
  }
})

// Listener para mensagens de outras partes da extensão
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('📨 [Dynamics Extension] Mensagem recebida no background:', message)
  
  // Login
  if (message.type === 'LOGIN') {
    authManager.login()
      .then(token => {
        sendResponse({ success: true, token })
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message })
      })
    return true
  }
  
  // Obter token
  if (message.type === 'GET_AUTH_TOKEN') {
    authManager.getAuthToken()
      .then(token => {
        sendResponse({ success: true, token })
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message })
      })
    return true
  }
  
  // Logout
  if (message.type === 'LOGOUT') {
    authManager.clearAuth()
      .then(() => {
        sendResponse({ success: true })
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message })
      })
    return true
  }
  
  // Informações do usuário
  if (message.type === 'GET_USER_INFO') {
    authManager.getUserInfo()
      .then(userInfo => {
        sendResponse({ success: true, data: userInfo })
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message })
      })
    return true
  }
  
  // Trocar código de autorização por tokens
  if (message.type === 'EXCHANGE_AUTH_CODE') {
    authManager.exchangeCodeForToken(message.code)
      .then(() => {
        sendResponse({ success: true })
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message })
      })
    return true
  }
  
  // Erro de autenticação
  if (message.type === 'AUTH_ERROR') {
    console.error('❌ [Auth] Erro recebido do callback:', message.error)
    sendResponse({ success: true })
    return true
  }
  
  // Content script pronto
  if (message.type === 'CONTENT_READY') {
    console.log('✅ [Dynamics Extension] Content script pronto:', message.url)
    sendResponse({ success: true, message: 'Background recebeu a mensagem!' })
  }
  
  return true // Mantém o canal aberto para resposta assíncrona
})

// Exportação vazia para TypeScript reconhecer como módulo
export {}
