import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ensureDefaultMockAccounts } from "@/lib/authAccountStore";

// Initialize the React application by rendering the App component
// into the root DOM element. This is the entry point for the VitaCare landing page.
ensureDefaultMockAccounts();

createRoot(document.getElementById("root")!).render(<App />);
