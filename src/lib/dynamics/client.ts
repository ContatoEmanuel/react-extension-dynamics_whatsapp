import axios, { AxiosInstance } from 'axios'

export class DynamicsClient {
  private client: AxiosInstance
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.client = axios.create({
      baseURL: `${baseUrl}/api/data/v9.2`,
      headers: {
        'Content-Type': 'application/json',
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
      },
    })

    // Interceptor para adicionar token de autenticação
    this.client.interceptors.request.use(async (config) => {
      const token = await this.getAuthToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  private async getAuthToken(): Promise<string | null> {
    // TODO: Implementar obtenção do token do background
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'GET_AUTH_TOKEN' }, (response) => {
        resolve(response?.token || null)
      })
    })
  }

  async searchContact(phoneNumber: string) {
    try {
      // Remove caracteres não numéricos do telefone
      const cleanPhone = phoneNumber.replace(/\D/g, '')
      
      // Busca contato por telefone no Dynamics
      const response = await this.client.get('/contacts', {
        params: {
          $filter: `contains(telephone1,'${cleanPhone}') or contains(mobilephone,'${cleanPhone}')`,
          $select: 'contactid,fullname,emailaddress1,telephone1,mobilephone',
        },
      })

      return response.data.value
    } catch (error) {
      console.error('❌ Erro ao buscar contato:', error)
      throw error
    }
  }

  async getContactById(contactId: string) {
    try {
      const response = await this.client.get(`/contacts(${contactId})`)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar contato por ID:', error)
      throw error
    }
  }

  async createActivity(data: ActivityData) {
    try {
      const response = await this.client.post('/phonecalls', data)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao criar atividade:', error)
      throw error
    }
  }
}

interface ActivityData {
  subject: string
  description?: string
  phonenumber?: string
  directioncode?: boolean
  actualdurationminutes?: number
  [key: string]: any
}
