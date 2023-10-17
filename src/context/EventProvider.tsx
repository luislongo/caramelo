import { useEffect } from "react";
import { DefaultEventMessenger } from "../messenger/DefaultMessenger";
import {
  AddCallbackParams,
  EmitParams,
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
    ...[name, callback, options]: AddCallbackParams<T, K>
  ) => {
    useEffect(() => {
      const id = messenger.addCallback<K>(
        ...([name, callback, options] as AddCallbackParams<T, K>)
      );

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
