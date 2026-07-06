// Centralizes environment-derived config so no other file reads
// import.meta.env directly. Falls back to the Vite dev proxy path
// (see vite.config.ts) when VITE_API_BASE_URL isn't set.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/tasks";
