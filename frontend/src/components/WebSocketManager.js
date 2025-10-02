import { useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

const WebSocketManager = ({ user }) => {
  const { connect, disconnect, isConnected } = useWebSocket();

  useEffect(() => {
    if (user) {
      // Connect WebSocket when user is authenticated
      const token = localStorage.getItem('token');
      if (token && !isConnected) {
        console.log('🔌 Connecting WebSocket for user:', user.email);
        connect(token);
      }
    } else {
      // Disconnect WebSocket when user logs out
      if (isConnected) {
        console.log('🔌 Disconnecting WebSocket');
        disconnect();
      }
    }

    // Cleanup on unmount
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [user, connect, disconnect, isConnected]);

  // This component doesn't render anything
  return null;
};

export default WebSocketManager;