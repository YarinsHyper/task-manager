/// <reference types="vite/client" />

// Types the custom VITE_API_BASE_URL env var so config.ts gets autocomplete
// and type-checking on import.meta.env.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

