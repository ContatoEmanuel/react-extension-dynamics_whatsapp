/**
 * Cliente para validação de licença via Azure
 */

export class LicenseValidator {
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  async validateLicense(licenseKey: string): Promise<LicenseValidationResult> {
    try {
      const response = await fetch(`${this.apiUrl}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseKey }),
      })

      if (!response.ok) {
        throw new Error('Falha na validação da licença')
      }

      const data = await response.json()
      return {
        isValid: data.isValid,
        expiresAt: data.expiresAt,
        features: data.features || [],
      }
    } catch (error) {
      console.error('❌ Erro ao validar licença:', error)
      return {
        isValid: false,
        expiresAt: null,
        features: [],
      }
    }
  }

  async checkLicenseStatus(): Promise<boolean> {
    try {
      const stored = await chrome.storage.local.get('licenseKey')
      
      if (!stored.licenseKey) {
        return false
      }

      const result = await this.validateLicense(stored.licenseKey)
      
      // Salva status da licença
      await chrome.storage.local.set({
        licenseValid: result.isValid,
        licenseExpiry: result.expiresAt,
      })

      return result.isValid
    } catch (error) {
      console.error('❌ Erro ao verificar status da licença:', error)
      return false
    }
  }
}

interface LicenseValidationResult {
  isValid: boolean
  expiresAt: string | null
  features: string[]
}
