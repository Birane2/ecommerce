/* eslint-disable react-refresh/only-export-components -- provider + hook colocated on purpose */
import { createContext, useCallback, useContext, useState } from "react";
import { FaCircleCheck, FaCircleXmark, FaCircleInfo } from "react-icons/fa6";
import "./toast.css";

const ToastContext = createContext(null);

const ICONS = {
  success: <FaCircleCheck />,
  error: <FaCircleXmark />,
  info: <FaCircleInfo />,
};

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = 2800) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast_stack" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast_${toast.type}`}>
            {ICONS[toast.type]}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast doit être utilisé à l'intérieur d'un ToastProvider");
  }
  return context;
}
