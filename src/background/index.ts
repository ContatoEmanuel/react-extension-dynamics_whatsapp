console.log('🚀 [Dynamics Extension] Background Service Worker iniciado')

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
  
  if (message.type === 'CONTENT_READY') {
    console.log('✅ [Dynamics Extension] Content script pronto:', message.url)
    sendResponse({ success: true, message: 'Background recebeu a mensagem!' })
  }
  
  return true // Mantém o canal aberto para resposta assíncrona
})

// Exportação vazia para TypeScript reconhecer como módulo
export {}
