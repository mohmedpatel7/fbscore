import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Import BrowserRouter
import App from "./App.jsx";
import { ToastProvider } from "./components/Genral/ToastContext.jsx";
import { Provider } from "react-redux";
import store from "./Redux/store/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastProvider>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </ToastProvider>
  </Provider>
);
