import 'vite/client'

/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly ENABLE_BOOTSTRAP_REBOOT?: string
}
