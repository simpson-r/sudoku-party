import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { ClientMessage, ServerMessage } from '@shared/types';

// types
type MessageHandler = (message: ServerMessage) => void;
type MessageDispatch = (message: ClientMessage) => void;
type MessageSubscriber = (handler: MessageHandler) => () => void;

type WebSocketContextValue = {
  isConnected: boolean;
  send: MessageDispatch;
  subscribe: MessageSubscriber;
};

// constants
const WebSocketContext = createContext<WebSocketContextValue | null>(null);

/**
 * This component provides WebSocket connection state and actions to descendant components.
 */
export const WebSocketProvider = ({ children }: React.PropsWithChildren) => {
  const [isConnected, setIsConnected] = useState(false);
  const subscriberRef = useRef<MessageHandler[]>([]);
  const ws = useRef<WebSocket>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as ServerMessage;
      const subscribers = subscriberRef.current;
      subscribers.forEach((subscriber) => subscriber(message));
    };
    ws.current = socket;

    return () => socket.close();
  }, []);

  const subscribe = (handler: MessageHandler) => {
    subscriberRef.current.push(handler);

    return () => {
      subscriberRef.current = subscriberRef.current.filter(
        (subscriber) => subscriber !== handler,
      );
    };
  };

  const send = (message: ClientMessage) => {
    if (ws.current?.readyState !== WebSocket.OPEN) return;
    ws.current.send(JSON.stringify(message));
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, send, subscribe }}>
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
