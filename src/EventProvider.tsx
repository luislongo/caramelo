import { createContext, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { DefaultEventMessenger } from "./mesenger/DefaultEventMessenger";
import { IEventMessenger } from "./mesenger/IEventMessenger";

type EventProviderContextProps = {
  useEvent: (name: string, callback: () => void) => void;
  emitEvent: (name: string) => void;
};
export const EventProviderContext = createContext<EventProviderContextProps>(
  {} as EventProviderContextProps
);

export type EventProviderProps = {
  children: React.ReactNode;
  messenger?: IEventMessenger;
};

export const EventProvider = ({
  children,
  messenger = new DefaultEventMessenger(),
}: EventProviderProps) => {
  const useEvent = (name: string, callback: () => void) => {
    useEffect(() => {
      const id = uuid();

      messenger.addCallback(name, callback);

      return () => {
        messenger.removeCallback(name, id);
      };
    }, [callback, name]);
  };

  const emitEvent = (name: string) => {
    messenger.emit(name);
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
