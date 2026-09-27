import { createContext, useContext, useEffect, useRef, useState } from 'react';

type WebSocketContextValue = {
  isConnected: boolean;
  message: string | null;
  send: (outgoingMessage: string) => void;
};

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

/**
 * This component provides WebSocket connection state and actions to descendant components.
 */
export const WebSocketProvider = ({ children }: React.PropsWithChildren) => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const ws = useRef<WebSocket>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    socket.onmessage = (event) => setMessage(event.data);
    ws.current = socket;

    return () => socket.close();
  }, []);

  const send = (outgoingMessage: string) => {
    if (ws.current?.readyState !== WebSocket.OPEN) return;
    ws.current.send(outgoingMessage);
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, message, send }}>
      {children}
    </WebSocketContext.Provider>
  );
};

/**
 * This hook provides access to the WebSocket connection state and actions
 */
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  return context;
};
