import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { DefaultEventMessenger } from "../messenger/DefaultMessenger";
import { EventCallback, EventType } from "../messenger/Messenger.types";
import { EventProviderProps } from "./EventProvider.types";

export const EventProvider = <T extends Record<string, EventType<unknown>>>({
  children,
  messenger = new DefaultEventMessenger<T>(),
  context: Context,
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
