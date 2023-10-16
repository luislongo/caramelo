import { createContext } from "react";
import { EventProvider, EventProviderContextProps } from "./EventProvider";
import { EventType } from "./mesenger/IEventMessenger";

export const createEventContext = <
  T extends Record<string, EventType<unknown>>
>(
  initialState: EventProviderContextProps<T>
) => {
  const EventContext =
    createContext<EventProviderContextProps<T>>(initialState);

  const Provider = EventProvider<T>;

  return { EventContext, Provider };
};
