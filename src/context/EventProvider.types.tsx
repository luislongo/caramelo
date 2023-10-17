import {
  AddCallbackParams,
  EmitParams,
  EventType,
  IMessenger,
} from "../messenger/Messenger.types";

export type EventProviderProps<
  T extends Record<string, EventType<unknown, unknown>>
> = {
  children: React.ReactNode;
  messenger?: IMessenger<T>;
  context: React.Context<EventProviderContextProps<T>>;
};

export type EventProviderContextProps<
  T extends Record<string, EventType<unknown, unknown>>
> = {
  useEvent: <K extends keyof T>(...args: AddCallbackParams<T, K>) => void;
  emitEvent: <K extends keyof T>(...args: EmitParams<T, K>) => void;
};
