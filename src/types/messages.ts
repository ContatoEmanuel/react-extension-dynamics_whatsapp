/**
 * Types para mensagens da extensão
 */

export type MessageType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'GET_AUTH_TOKEN'
  | 'GET_USER_INFO'
  | 'EXCHANGE_AUTH_CODE'
  | 'AUTH_ERROR'
  | 'SEARCH_CONTACT'
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

export interface UserInfoResponse {
  success: boolean
  data?: {
    displayName: string
    mail: string
    userPrincipalName: string
    id: string
  }
  error?: string
}

export interface ContactInfoMessage {
  phoneNumber: string
  contactData?: any
}

export interface LoginResponse {
  success: boolean
  token?: string
  error?: string
}
