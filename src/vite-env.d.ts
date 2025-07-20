/// <reference types="vite/client" />

// Vite environment variable types
interface ImportMetaEnv {
  readonly VITE_YNAB_API_KEY: string;
  // add other env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
