import { createContext } from "react";
import { EventProvider } from "./EventProvider";
import { EventType } from "../messenger/Messenger.types";
import { EventProviderContextProps } from "./EventProvider.types";

export const createEventContext = <
  T extends Record<string, EventType<unknown, unknown>>
>(
  initialState: EventProviderContextProps<T>
) => {
  const Context = createContext<EventProviderContextProps<T>>(initialState);

  const Provider = EventProvider<T>;

  return { Context, Provider };
};
