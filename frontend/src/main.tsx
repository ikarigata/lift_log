import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.tsx'

async function enableMocking() {
  // 環境変数でMSWの使用を制御
  const useMSW = import.meta.env.VITE_USE_MSW === 'true'
  
  if (!useMSW) {
    console.log('MSW: Disabled by environment variable, using real API')
    return
  }

  console.log('MSW: Enabling mocking...')
  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and running.
  return worker.start({
    onUnhandledRequest: 'bypass'  // 未処理のリクエストは静かに無視
  }).then(() => {
    console.log('MSW: Mock service worker started')
  })
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>,
  )
})