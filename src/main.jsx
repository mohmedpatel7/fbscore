import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider } from "./components/Genral/ToastContext.jsx";
import { Provider } from "react-redux";
import store from "./Redux/store/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ToastProvider>
  </Provider>
);
