/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MSW: string
  readonly VITE_API_BASE_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}