import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastContainer } from './ToastNotification.jsx';
import API_BASE_URL from '../config/api';

const NotificationSystem = ({ userEmail }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastNotifications, setToastNotifications] = useState([]);
  const [lastNotificationId, setLastNotificationId] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch notifications when component mounts or when email changes
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userEmail) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/notifications/user/${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUnreadCount = async () => {
      if (!userEmail) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/notifications/unread-count/${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    if (userEmail) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Set up polling to check for new notifications every 30 seconds
      const notificationInterval = setInterval(() => {
        fetchNotifications();
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(notificationInterval);
    }
  }, [userEmail]);

  // Check for new notifications and show toast
  useEffect(() => {
    if (notifications.length > 0 && lastNotificationId !== null) {
      const newNotifications = notifications.filter(notif => 
        notif.id > lastNotificationId && !notif.is_read
      );
      
      if (newNotifications.length > 0) {
        // Show toast for new notifications
        newNotifications.forEach(notif => {
          setToastNotifications(prev => [...prev, notif]);
        });
      }
    }
    
    // Update last notification ID
    if (notifications.length > 0) {
      const maxId = Math.max(...notifications.map(n => n.id));
      setLastNotificationId(maxId);
    }
  }, [notifications, lastNotificationId]);

  const removeToastNotification = (notificationId) => {
    setToastNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/read/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true, read_at: new Date().toISOString() }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/read-all/${userEmail}`, {
        method: 'PUT'
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ 
            ...notif, 
            is_read: true, 
            read_at: new Date().toISOString() 
          }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        // Update unread count if the deleted notification was unread
        const deletedNotif = notifications.find(n => n.id === notificationId);
        if (deletedNotif && !deletedNotif.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'donation_approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'donation_declined':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'blood_request_fulfilled':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time.toLocaleDateString();
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer 
        notifications={toastNotifications} 
        onRemove={removeToastNotification} 
      />
      
      <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-lg"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
                <p className="mt-2 text-sm">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                    !notification.is_read ? 'bg-gray-700/30' : ''
                  }`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${
                          !notification.is_read ? 'text-white' : 'text-gray-300'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-700 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Could navigate to a full notifications page here
                }}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default NotificationSystem;
