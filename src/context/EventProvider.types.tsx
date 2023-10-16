import {
  EventCallback,
  EventType,
  IMessenger,
} from "../messenger/Messenger.types";

export type EventProviderProps<T extends Record<string, EventType<unknown>>> = {
  children: React.ReactNode;
  messenger?: IMessenger<T>;
  context: React.Context<EventProviderContextProps<T>>;
};

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
