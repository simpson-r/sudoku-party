import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { ClientMessage, ServerMessage } from '@sudokuparty/shared/types';

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
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080';

// context
const WebSocketContext = createContext<WebSocketContextValue | null>(null);

/**
 * This component provides WebSocket connection state and actions to descendant components.
 */
export const WebSocketProvider = ({ children }: React.PropsWithChildren) => {
  const [isConnected, setIsConnected] = useState(false);
  const subscriberRef = useRef<Set<MessageHandler>>(new Set());
  const ws = useRef<WebSocket>(null);

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let shouldReconnect = true;

    const connect = () => {
      const socket = new WebSocket(WS_URL);
      ws.current = socket;

      socket.onopen = () => setIsConnected(true);

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data) as ServerMessage;

        subscriberRef.current.forEach((subscriber) => {
          subscriber(message);
        });
      };

      socket.onclose = () => {
        setIsConnected(false);

        if (shouldReconnect) {
          reconnectTimer = setTimeout(connect, 1000);
        }
      };
    };

    connect();

    return () => {
      shouldReconnect = false;
      clearTimeout(reconnectTimer);
      ws.current?.close();
    };
  }, []);
  const subscribe = (subscriber: MessageHandler) => {
    subscriberRef.current.add(subscriber);

    return () => {
      subscriberRef.current.delete(subscriber);
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
