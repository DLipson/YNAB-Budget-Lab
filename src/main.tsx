import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// BaseUI and Styletron setup
import { StyletronProvider } from "baseui";
import { BaseProvider, LightTheme } from "baseui";
import { Client } from "styletron-engine-atomic";

const engine = new Client();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <App />
      </BaseProvider>
    </StyletronProvider>
  </StrictMode>
);
