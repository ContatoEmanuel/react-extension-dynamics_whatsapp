import { useState, useEffect } from 'react'

function App() {
  const [config, setConfig] = useState({
    dynamicsUrl: '',
    clientId: '',
    tenantId: '',
  })

  useEffect(() => {
    // Carrega configurações salvas
    chrome.storage.local.get(['dynamicsUrl', 'clientId', 'tenantId'], (result) => {
      if (result.dynamicsUrl) {
        setConfig({
          dynamicsUrl: result.dynamicsUrl,
          clientId: result.clientId,
          tenantId: result.tenantId,
        })
      }
    })
  }, [])

  const handleSave = () => {
    chrome.storage.local.set(config, () => {
      alert('Configurações salvas com sucesso!')
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Configurações da Extensão
          </h1>
          <p className="text-gray-600">
            Configure a integração com Dynamics 365
          </p>
        </header>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL do Dynamics 365
              </label>
              <input
                type="text"
                value={config.dynamicsUrl}
                onChange={(e) => setConfig({ ...config, dynamicsUrl: e.target.value })}
                placeholder="https://yourorg.crm2.dynamics.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Azure Client ID
              </label>
              <input
                type="text"
                value={config.clientId}
                onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                placeholder="your-client-id"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Azure Tenant ID
              </label>
              <input
                type="text"
                value={config.tenantId}
                onChange={(e) => setConfig({ ...config, tenantId: e.target.value })}
                placeholder="your-tenant-id"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleSave}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
