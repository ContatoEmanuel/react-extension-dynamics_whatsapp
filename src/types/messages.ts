/**
 * Types para mensagens da extensão
 */

export type MessageType =
  | 'GET_AUTH_TOKEN'
  | 'SYNC_DATA'
  | 'CONTENT_READY'
  | 'SHOW_CONTACT_INFO'
  | 'OPEN_SIDE_PANEL'
  | 'PHONE_CHANGED'

export interface ExtensionMessage<T = any> {
  type: MessageType
  payload?: T
}

export interface AuthTokenResponse {
  success: boolean
  token?: string
  error?: string
}

export interface ContactInfoMessage {
  phoneNumber: string
  contactData?: any
}
