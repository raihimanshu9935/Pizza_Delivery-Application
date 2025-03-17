import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import "../../styles/Notification.css";

const Notification = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`notification ${type}`}>
      <div className="notification-icon">
        <FaCheckCircle />
      </div>
      <div className="notification-message">{message}</div>
      <button
        className="notification-close"
        onClick={() => setIsVisible(false)}
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Notification;
