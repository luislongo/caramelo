import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { DefaultEventMessenger } from "../messenger/DefaultMessenger";
import {
  EmitParams,
  EventCallback,
  EventType,
} from "../messenger/Messenger.types";
import { EventProviderProps } from "./EventProvider.types";

export const EventProvider = <
  T extends Record<string, EventType<unknown, unknown>>
>({
  children,
  messenger = new DefaultEventMessenger<T>(),
  context: Context,
}: EventProviderProps<T>) => {
  const useEvent = <K extends keyof T>(
    name: K,
    callback: EventCallback<T[K]["payload"]>,
    options: T[K]["options"]
  ) => {
    useEffect(() => {
      const id = uuid();

      messenger.addCallback(name, callback, options);

      return () => {
        messenger.removeCallback(name, id);
      };
    }, [callback, name, options]);
  };

  const emitEvent = <K extends keyof T>(...args: EmitParams<T, K>) => {
    messenger.emit(...args);
  };

  return (
    <Context.Provider
      value={{
        useEvent,
        emitEvent,
      }}
    >
      {children}
    </Context.Provider>
  );
};
