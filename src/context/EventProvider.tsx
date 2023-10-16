import { createContext, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { DefaultEventMessenger } from "../messenger/DefaultEventMessenger";
import {
  EventCallback,
  EventType,
  IEventMessenger,
} from "../messenger/IEventMessenger";

export type EventProviderContextProps<
  T extends Record<string, EventType<unknown>> = Record<
    string,
    EventType<unknown>
  >
> = {
  useEvent: <K extends keyof T>(
    name: K,
    callback: EventCallback<T[K]["payload"]>
  ) => void;
  emitEvent: <K extends keyof T>(name: K, payload: T[K]["payload"]) => void;
};

export const EventProviderContext = createContext<EventProviderContextProps>(
  {} as EventProviderContextProps
);

export type EventProviderProps<T extends Record<string, EventType<unknown>>> = {
  children: React.ReactNode;
  messenger?: IEventMessenger<T>;
};

export const EventProvider = <T extends Record<string, EventType<unknown>>>({
  children,
  messenger = new DefaultEventMessenger<T>(),
}: EventProviderProps<T>) => {
  const useEvent = <K extends keyof T>(
    name: K,
    callback: EventCallback<T[K]["payload"]>
  ) => {
    useEffect(() => {
      const id = uuid();

      messenger.addCallback(name, callback);

      return () => {
        messenger.removeCallback(name, id);
      };
    }, [callback, name]);
  };

  const emitEvent = <K extends keyof T>(name: K, payload: T[K]["payload"]) => {
    messenger.emit(name, payload);
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
