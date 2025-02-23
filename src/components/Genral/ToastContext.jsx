import React, { createContext, useContext, useState } from "react";

// Create Toast Context
const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Render Toasts */}
      <div
        className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 1050 }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show bg-${toast.type} text-white`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-body">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use Toast Context
export const useToast = () => useContext(ToastContext);
