/**
 * Observer para monitorar mudanças no DOM do WhatsApp Web
 */

export class WhatsAppDOMObserver {
  private observer: MutationObserver | null = null;
  private currentPhone: string | null = null;

  constructor(private onPhoneChange: (phone: string) => void) {}

  start() {
    this.observer = new MutationObserver(() => {
      this.checkActiveChat();
    });

    const targetNode = document.querySelector('#app');
    if (targetNode) {
      this.observer.observe(targetNode, {
        childList: true,
        subtree: true,
      });
      console.log('👁️ Observer do WhatsApp iniciado');
    }
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
      console.log('👁️ Observer do WhatsApp parado');
    }
  }

  private checkActiveChat() {
    const phone = this.extractPhoneNumber();
    
    if (phone && phone !== this.currentPhone) {
      this.currentPhone = phone;
      this.onPhoneChange(phone);
    }
  }

  private extractPhoneNumber(): string | null {
    // TODO: Implementar extração real do número de telefone
    // Esta é uma versão simplificada que precisa ser adaptada
    
    // Tenta encontrar o elemento que contém o número
    const headerElement = document.querySelector('[data-testid="conversation-header"]');
    if (!headerElement) return null;

    // Extrai o número do atributo ou texto
    // A implementação real dependerá da estrutura atual do WhatsApp Web
    const phoneMatch = headerElement.textContent?.match(/\+?[\d\s()-]+/);
    return phoneMatch ? phoneMatch[0].replace(/\D/g, '') : null;
  }

  getCurrentPhone(): string | null {
    return this.currentPhone;
  }
}
