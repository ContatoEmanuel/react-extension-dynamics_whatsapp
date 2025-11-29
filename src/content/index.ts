console.log('🚀 [Dynamics Extension] Content Script injetado no WhatsApp Web!')
console.log('✅ [Dynamics Extension] Extensão funcionando corretamente')

// Verifica se está na página correta
if (window.location.hostname === 'web.whatsapp.com') {
  console.log('📱 [Dynamics Extension] WhatsApp Web detectado!')
  initContentScript()
}

function initContentScript() {
  console.log('⚡ [Dynamics Extension] Inicializando integração com WhatsApp')
  
  // Envia mensagem para background informando que está pronto
  chrome.runtime.sendMessage({ 
    type: 'CONTENT_READY',
    url: window.location.href 
  }, (response) => {
    console.log('📨 [Dynamics Extension] Resposta do background:', response)
  })
}

// Exportação vazia para TypeScript reconhecer como módulo
export {}
