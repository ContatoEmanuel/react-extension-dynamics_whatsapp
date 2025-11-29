/**
 * Injeta elementos customizados na UI do WhatsApp Web
 */

export class UIInjector {
  private injectedElements: Set<string> = new Set();

  injectButton(containerId: string, buttonConfig: ButtonConfig) {
    if (this.injectedElements.has(containerId)) {
      console.log('⚠️ Elemento já injetado:', containerId);
      return;
    }

    const container = document.querySelector(containerId);
    if (!container) {
      console.warn('❌ Container não encontrado:', containerId);
      return;
    }

    const button = this.createButton(buttonConfig);
    container.appendChild(button);
    this.injectedElements.add(containerId);
    
    console.log('✅ Botão injetado em:', containerId);
  }

  private createButton(config: ButtonConfig): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = config.label;
    button.className = config.className || 'dynamics-btn';
    button.style.cssText = config.style || this.getDefaultButtonStyle();
    
    button.addEventListener('click', config.onClick);
    
    return button;
  }

  private getDefaultButtonStyle(): string {
    return `
      padding: 8px 16px;
      background: #0078d4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin: 4px;
    `;
  }

  removeAll() {
    this.injectedElements.forEach(id => {
      const element = document.querySelector(id);
      if (element) {
        element.remove();
      }
    });
    this.injectedElements.clear();
  }
}

interface ButtonConfig {
  label: string;
  onClick: () => void;
  className?: string;
  style?: string;
}
