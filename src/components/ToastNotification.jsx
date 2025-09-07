import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastNotification = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'donation_approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'donation_declined':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'donation_approved':
        return 'bg-green-600';
      case 'donation_declined':
        return 'bg-yellow-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div
      className={`${getBgColor()} text-white p-4 rounded-lg shadow-lg border border-white/20 max-w-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{notification.title}</h4>
          <p className="text-sm opacity-90 mt-1 leading-relaxed">
            {notification.message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ToastContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <ToastNotification
          key={`${notification.id}-${index}`}
          notification={notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

export { ToastNotification, ToastContainer };
