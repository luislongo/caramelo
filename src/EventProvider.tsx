import { createContext, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

type EventProviderContextProps = {
  useEvent: (name: string, callback: () => void) => void;
  emitEvent: (name: string) => void;
};
export const EventProviderContext = createContext<EventProviderContextProps>(
  {} as EventProviderContextProps
);

export type EventProviderProps = {
  children: React.ReactNode;
};

export const EventProvider = ({ children }: EventProviderProps) => {
  const callbackArrayRef = useRef<
    Record<string, Record<string, CallableFunction>>
  >({});

  const useEvent = (name: string, callback: () => void) => {
    useEffect(() => {
      const id = uuid();

      if (!callbackArrayRef.current[name]) {
        callbackArrayRef.current[name] = {};
      }
      callbackArrayRef.current[name][id] = callback;
      return () => {
        delete callbackArrayRef.current[name][id];
      };
    }, [callback, name]);
  };

  const emitEvent = (name: string) => {
    Object.values(callbackArrayRef.current[name] || []).forEach((callback) => {
      callback();
    });
  };

  return (
    <EventProviderContext.Provider
      value={{
        useEvent,
        emitEvent,
      }}
    >
      {children}
    </EventProviderContext.Provider>
  );
};
