import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

async function enableMocking() {
  // 'development'環境（`npm run dev`で起動した場合など）でのみモックを有効にする
  if (process.env.NODE_ENV !== 'development') {
    console.log('MSW: Not in development mode, skipping mock setup')
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
      <App />
    </React.StrictMode>,
  )
})