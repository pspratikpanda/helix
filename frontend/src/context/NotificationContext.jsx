import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from endpoint on initialization/login
  const fetchNotifications = async () => {
    if (token) {
      try {
        const res = await apiClient.get('/notifications');
        if (res.data && res.data.success) {
          const list = res.data.data;
          setNotifications(list);
          // Assuming all newly fetched ones are unread by default on fresh session
          setUnreadCount(list.length);
        }
      } catch (error) {
        console.error('Failed to fetch notifications logbook:', error.message);
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  // Mark all notifications as read (bell dropdown is opened)
  const markAllRead = () => {
    setUnreadCount(0);
  };

  // Add an incoming socket notification to the stack
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAllRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationContext);
