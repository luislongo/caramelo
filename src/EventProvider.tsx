import { createContext, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { DefaultEventMessenger } from "./mesenger/DefaultEventMessenger";
import {
  EventCallback,
  EventNames,
  EventPayloads,
  IEventMessenger,
} from "./mesenger/IEventMessenger";

type EventProviderContextProps<
  T extends string[],
  P extends EventPayloads<T> = Record<T[number], never>
> = {
  useEvent: <K extends keyof EventNames<T>>(
    name: K,
    callback: EventCallback<P[K]>
  ) => void;
  emitEvent: <K extends keyof EventNames<T>>(name: K, payload: P[K]) => void;
};

export const EventProviderContext = createContext<
  EventProviderContextProps<["a", "b"], {}>
>({} as EventProviderContextProps<T, P>);

export type EventProviderProps<
  T extends string[] = string[],
  P extends EventPayloads<T> = EventPayloads<T>
> = {
  children: React.ReactNode;
  messenger?: IEventMessenger<T, P>;
};

export const EventProvider = <
  T extends string[] = string[],
  P extends EventPayloads<T> = EventPayloads<T>
>({
  children,
  messenger = new DefaultEventMessenger<T, P>(),
}: EventProviderProps<T, P>) => {
  const useEvent = (
    name: keyof EventNames<T>,
    callback: EventCallback<P[typeof name]>
  ) => {
    useEffect(() => {
      const id = uuid();

      messenger.addCallback(name, callback);

      return () => {
        messenger.removeCallback(name, id);
      };
    }, [callback, name]);
  };

  const emitEvent = (name: keyof EventNames<T>, payload: P[typeof name]) => {
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
