console.log('🚀 Background Service Worker iniciado');

// Listener para instalação da extensão
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('✅ Extensão instalada pela primeira vez');
    // Abre página de configuração inicial
    chrome.runtime.openOptionsPage();
  } else if (details.reason === 'update') {
    console.log('🔄 Extensão atualizada');
  }
});

// Listener para mensagens de outras partes da extensão
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Mensagem recebida:', message);
  
  if (message.type === 'GET_AUTH_TOKEN') {
    // Lógica de autenticação será implementada aqui
    handleAuthToken(sendResponse);
    return true; // Mantém o canal aberto para resposta assíncrona
  }
  
  if (message.type === 'SYNC_DATA') {
    // Sincronização com Dynamics
    handleDataSync(message.payload, sendResponse);
    return true;
  }
});

async function handleAuthToken(sendResponse: (response: any) => void) {
  try {
    // TODO: Implementar lógica de autenticação OAuth
    const token = await chrome.storage.local.get('authToken');
    sendResponse({ success: true, token: token.authToken });
  } catch (error) {
    sendResponse({ success: false, error: String(error) });
  }
}

async function handleDataSync(payload: any, sendResponse: (response: any) => void) {
  try {
    // TODO: Implementar sincronização com Dynamics
    console.log('🔄 Sincronizando dados:', payload);
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ success: false, error: String(error) });
  }
}

// Exportação vazia para TypeScript reconhecer como módulo
export {};
