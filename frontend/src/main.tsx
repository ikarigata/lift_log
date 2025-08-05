import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { saveToken, isAuthenticated } from './utils/auth'

async function enableMocking() {
  // 環境変数でMSWの使用を制御
  const useMSW = import.meta.env.VITE_USE_MSW === 'true'
  
  if (!useMSW) {
    console.log('MSW: Disabled by environment variable, using real API')
    return
  }

  console.log('MSW: Enabling mocking...')
  const { worker } = await import('./mocks/browser')

  // Service Workerを起動
  await worker.start({
    onUnhandledRequest: 'bypass'
  })
  console.log('MSW: Mock service worker started')

  // モック環境で、かつ未認証の場合に自動でログイン処理を行う
  if (!isAuthenticated()) {
    console.log('MSW: Not authenticated, attempting mock login...')
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' })
      })

      if (response.ok) {
        const { token } = await response.json()
        saveToken(token)
        console.log('MSW: Mock login successful, token saved.')
      } else {
        console.error('MSW: Mock login failed.', await response.text())
      }
    } catch (error) {
      console.error('MSW: Error during mock login fetch:', error)
    }
  } else {
    console.log('MSW: Already authenticated.')
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})