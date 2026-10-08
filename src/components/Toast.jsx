import React from "react";

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-${toast.type}`}
          onClick={() => onDismiss(toast.id)}
        >
          <span className="toast-icon">
            {toast.type === "success" && "✅"}
            {toast.type === "error" && "⚠️"}
            {toast.type === "info" && "ℹ️"}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(toast.id);
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
