/**
 * OAuth 2.0 Callback Handler
 * 
 * Esta página é chamada após o usuário autorizar o app no Azure AD.
 * Extrai o código de autorização da URL e envia para o background service
 * para trocar por tokens de acesso.
 */

interface AuthResponse {
  success: boolean;
  error?: string;
}

// Função para extrair parâmetros da URL
function getUrlParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

// Função para exibir erro
function showError(message: string): void {
  const errorDiv = document.getElementById('error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
  console.error('Erro de autenticação:', message);
}

// Função principal de callback
async function handleCallback(): Promise<void> {
  try {
    const params = getUrlParams();
    const code = params.get('code');
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    // Verificar se houve erro na autorização
    if (error) {
      const errorMsg = errorDescription || error;
      showError(`Erro na autorização: ${errorMsg}`);
      
      // Notificar background sobre o erro
      chrome.runtime.sendMessage({
        type: 'AUTH_ERROR',
        error: errorMsg
      });
      
      // Fechar a janela após 3 segundos
      setTimeout(() => window.close(), 3000);
      return;
    }

    // Verificar se o código foi recebido
    if (!code) {
      showError('Código de autorização não encontrado na URL');
      setTimeout(() => window.close(), 3000);
      return;
    }

    console.log('Código de autorização recebido, enviando para background...');

    // Enviar código para o background service processar
    const response = await chrome.runtime.sendMessage({
      type: 'EXCHANGE_AUTH_CODE',
      code: code
    }) as AuthResponse;

    if (response.success) {
      console.log('Autenticação concluída com sucesso!');
      
      // Atualizar UI
      const messageDiv = document.querySelector('.message');
      const submessageDiv = document.querySelector('.submessage');
      
      if (messageDiv) messageDiv.textContent = 'Autenticação concluída!';
      if (submessageDiv) submessageDiv.textContent = 'Você será redirecionado em instantes...';
      
      // Fechar a janela após 1 segundo
      setTimeout(() => window.close(), 1000);
    } else {
      showError(response.error || 'Erro ao processar autenticação');
      setTimeout(() => window.close(), 3000);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    showError(`Erro ao processar callback: ${errorMessage}`);
    setTimeout(() => window.close(), 3000);
  }
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleCallback);
} else {
  handleCallback();
}
