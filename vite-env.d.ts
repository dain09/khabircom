// Fix: Removed the triple-slash directive for "vite/client".
// This resolves the "Cannot find type definition file" error which is likely due to a project setup issue.
// The interfaces below provide the necessary types for the environment variables used in the app.

interface ImportMetaEnv {
  readonly VITE_API_KEYS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
