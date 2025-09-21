// FIX: The reference to "vite/client" is causing an error. We will manually define the necessary types for `import.meta.env` and `process.env` instead by commenting out the failing reference and providing our own definitions below.
// /// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Per Gemini API guidelines, process.env.API_KEY must be used.
// We declare `process` here to make it available to TypeScript globally.
declare const process: {
  env: {
    API_KEY?: string;
  }
};
