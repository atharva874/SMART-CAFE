import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket'],
        reconnection: true
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        
        if (user.role === 'admin') {
          newSocket.emit('join-admin');
        } else {
          newSocket.emit('join-customer', user.id);
        }
      });

      // Listen for new orders (admin only)
      newSocket.on('new-order', (data) => {
        if (user.role === 'admin') {
          toast.info(`🔔 New Order Received! Order #${data.orderNumber}`, {
            autoClose: 5000
          });
        }
      });

      // Listen for order status updates
      newSocket.on('order-status-update', (data) => {
        toast.info(`Order status updated to: ${data.status}`, {
          autoClose: 4000
        });
      });

      // Listen for order confirmation
      newSocket.on('order-confirmed', (data) => {
        toast.success(`Order Confirmed! Order #${data.orderNumber}`, {
          autoClose: 5000
        });
      });

      // Listen for order cancellation
      newSocket.on('order-cancelled', (data) => {
        if (user.role === 'admin') {
          toast.warning(`Order #${data.orderNumber} has been cancelled`);
        }
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const value = {
    socket
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
