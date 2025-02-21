import React from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

const Notification = ({ message, type, onClose }) => {
  const colors = {
    success: "bg-green-100 text-green-800 border-green-500",
    error: "bg-red-100 text-red-800 border-red-500",
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-4 border rounded-lg ${colors[type]}`}>
      <div className="flex items-center gap-2">
        {type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
        <span className="text-sm">{message}</span>
      </div>
      <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
        <FiX size={18} />
      </button>
    </div>
  );
};

export default Notification;
