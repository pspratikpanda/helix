import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNotificationsContext } from '../context/NotificationContext';
import toast from 'react-hot-toast';

const useNotifications = () => {
  const { token } = useAuth();
  const { addNotification } = useNotificationsContext();

  useEffect(() => {
    if (!token) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://127.0.0.1:3001';
    
    // Connect to Socket.io server passing token in handshake
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Successfully connected to HELIX Socket.io server.');
    });

    // Listen for new notifications
    socket.on('new-notification', (notification) => {
      addNotification(notification);
      
      // Fire visually pleasing themed toast
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-fade-in' : 'animate-fade-out'
          } max-w-sm w-full bg-[#2b5e75] border-l-4 border-[#e7c07d] shadow-2xl rounded-r p-4 flex flex-col`}
          style={{ boxShadow: '0 0 15px rgba(58, 153, 160, 0.4)' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-heading text-xs uppercase tracking-wider text-[#e7c07d]">
              ⚓ Ship's Log Alert
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
          <p className="text-xs text-[#c3e0ca] mt-1">{notification.message}</p>
        </div>
      ), { position: 'bottom-right', duration: 5000 });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket authentication/connection failed:', error.message);
    });

    // Clean up connections on unmount/token change
    return () => {
      socket.off('new-notification');
      socket.disconnect();
      console.log('Closed Socket.io logbook connection.');
    };
  }, [token, addNotification]);
};

export default useNotifications;
