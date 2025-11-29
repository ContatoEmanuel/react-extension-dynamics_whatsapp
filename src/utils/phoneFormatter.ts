/**
 * Formata número de telefone
 */
export function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Formato brasileiro: +55 (11) 98765-4321
  if (cleaned.length === 13 && cleaned.startsWith('55')) {
    const ddd = cleaned.substring(2, 4)
    const firstPart = cleaned.substring(4, 9)
    const secondPart = cleaned.substring(9)
    return `+55 (${ddd}) ${firstPart}-${secondPart}`
  }
  
  return phone
}

/**
 * Remove formatação do telefone, deixando apenas números
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '')
}

/**
 * Valida se o número de telefone é válido
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = cleanPhoneNumber(phone)
  // Valida números brasileiros (10 ou 11 dígitos com DDD)
  return /^55\d{10,11}$/.test(cleaned)
}
