import { useState, useEffect } from 'react'
import type { Contact } from '../types/dynamics'

/**
 * Hook para buscar dados do Dynamics
 */
export function useDynamicsContact(phoneNumber: string | null) {
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!phoneNumber) {
      setContact(null)
      return
    }

    let cancelled = false

    async function fetchContact() {
      setLoading(true)
      setError(null)

      try {
        // Envia mensagem para background buscar dados
        chrome.runtime.sendMessage(
          {
            type: 'SEARCH_CONTACT',
            payload: { phoneNumber },
          },
          (response) => {
            if (cancelled) return

            if (response?.success && response.data) {
              setContact(response.data)
            } else {
              setError(response?.error || 'Contato não encontrado')
            }
            setLoading(false)
          }
        )
      } catch (err) {
        if (!cancelled) {
          setError(String(err))
          setLoading(false)
        }
      }
    }

    fetchContact()

    return () => {
      cancelled = true
    }
  }, [phoneNumber])

  return { contact, loading, error }
}
