import { useState, useEffect } from 'react'
import type { LoginResponse, UserInfoResponse } from '../../types/messages'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  async function checkAuthStatus() {
    setLoading(true)
    try {
      const response: UserInfoResponse = await chrome.runtime.sendMessage({ 
        type: 'GET_USER_INFO' 
      })
      
      if (response.success && response.data) {
        setIsAuthenticated(true)
        setUserInfo(response.data)
      }
    } catch (error) {
      console.log('Usuário não autenticado')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin() {
    setLoading(true)
    try {
      const response: LoginResponse = await chrome.runtime.sendMessage({ 
        type: 'LOGIN' 
      })
      
      if (response.success) {
        await checkAuthStatus()
      } else {
        alert(`Erro ao fazer login: ${response.error}`)
      }
    } catch (error) {
      alert('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    setLoading(true)
    try {
      await chrome.runtime.sendMessage({ type: 'LOGOUT' })
      setIsAuthenticated(false)
      setUserInfo(null)
    } catch (error) {
      alert('Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-80 p-6 bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 p-6 bg-white">
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Dynamics 365 + WhatsApp
        </h1>
        
        {isAuthenticated ? (
          <div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-xs font-medium mb-1">
                ✅ Autenticado
              </p>
              <p className="text-gray-700 text-sm font-medium">
                {userInfo?.displayName}
              </p>
              <p className="text-gray-600 text-xs">
                {userInfo?.mail}
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 text-sm mb-4">
              Faça login para conectar com o Dynamics 365
            </p>
            
            <button
              onClick={handleLogin}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Fazer Login com Microsoft
            </button>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-xs">
                💡 Você será redirecionado para fazer login com sua conta Microsoft
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
