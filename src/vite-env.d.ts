/// <reference types="vite/client" />

interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_FORM_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
