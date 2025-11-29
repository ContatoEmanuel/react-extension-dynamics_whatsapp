import { useState } from 'react'

function App() {
  const [contactData] = useState<any>(null)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Dynamics 365 Integration
        </h1>
        <p className="text-gray-600">Informações do contato do WhatsApp</p>
      </header>

      <main>
        {!contactData ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum contato selecionado
            </h3>
            <p className="text-gray-500">
              Abra uma conversa no WhatsApp Web para ver as informações do Dynamics 365
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Dados do Contato</h3>
            {/* TODO: Exibir dados do Dynamics aqui */}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
