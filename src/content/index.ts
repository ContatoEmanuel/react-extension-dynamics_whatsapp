console.log('📱 Content Script carregado no WhatsApp Web');

// Verifica se está na página correta
if (window.location.hostname === 'web.whatsapp.com') {
  initContentScript();
}

function initContentScript() {
  console.log('✅ Inicializando integração com WhatsApp');
  
  // Envia mensagem para background informando que está pronto
  chrome.runtime.sendMessage({ 
    type: 'CONTENT_READY',
    url: window.location.href 
  });

  // Observa mudanças no DOM
  observeWhatsAppDOM();
}

function observeWhatsAppDOM() {
  // Observer será implementado em domObserver.ts
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // Detecta quando uma conversa é aberta
        handleConversationChange();
      }
    });
  });

  // Observa o elemento principal do WhatsApp
  const targetNode = document.querySelector('#app');
  if (targetNode) {
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
  }
}

function handleConversationChange() {
  // TODO: Extrair número de telefone da conversa ativa
  // TODO: Enviar para background para buscar dados no Dynamics
  console.log('💬 Conversa mudou');
}

// Listener para mensagens do background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SHOW_CONTACT_INFO') {
    // TODO: Exibir informações do contato na UI do WhatsApp
    console.log('👤 Mostrando info do contato:', message.data);
  }
  sendResponse({ received: true });
});

export {};
