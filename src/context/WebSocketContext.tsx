import { createContext, useContext, useEffect, useRef, useState } from "react";

export const WebSocketContext = createContext(false, null, () => {});

export const WebSocketProvider = ({ children }: React.PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState(null);

  const ws = useRef<WebSocket>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://echo.websocket.events/");
    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);
    socket.onmessage = (event) => setMessage(event.data);

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const value = [isReady, message, ws.current?.send.bind(ws.current)];

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
//And there’s our context! To use it, we just need to create a consumer.

// Very similar to the WsHook component above.
export const WsConsumer = () => {
  const [ready, val, send] = useContext(WebSocketContext); // use it just like a hook

  useEffect(() => {
    if (ready) {
      send("test message");
    }
  }, [ready, send]); // make sure to include send in dependency array

  return (
    <div>
      Ready: {JSON.stringify(ready)}, Value: {val}
    </div>
  );
};