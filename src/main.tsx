import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Minimal analytics & error tracking for production
if (import.meta.env.PROD) {
  // Plausible Analytics
  import("plausible-tracker").then(({ default: Plausible }) => {
    const plausible = Plausible({
      domain: "yourdomain.com", // TODO: replace with actual domain
      apiHost: "https://plausible.io",
    });
    plausible.trackPageview();
  });

  // Sentry Error Tracking
  import("@sentry/react").then((Sentry) => {
    Sentry.init({
      dsn: "https://examplePublicKey@o0.ingest.sentry.io/0", // TODO: replace with actual DSN
      integrations: [],
      tracesSampleRate: 0.1,
      environment: "production",
    });
  });
}

// BaseUI and Styletron setup
import { Provider as StyletronProvider } from "styletron-react";
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
