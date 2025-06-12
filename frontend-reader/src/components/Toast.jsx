import { useState, useEffect } from 'react';
import './Toast.css';

function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(), 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} ${visible ? 'visible' : 'hidden'}`}>
      <div className="toast-content">
        {message}
      </div>
      <button className="toast-close" onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
}

export default Toast; 