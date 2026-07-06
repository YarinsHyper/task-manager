import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// StrictMode double-invokes effects once in dev to catch missing cleanup
// -- see the hasFetchedRef guard in useTasks.ts for why that matters here.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
