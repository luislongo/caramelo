// type EventPayloads<T extends EventNames> = { [K in keyof T]: unknown };

export type EventNames<T extends string[]> = Record<T[number], string>;
export type EventPayloads<T extends string[]> = { [K in T[number]]: unknown };

export type EventCallback<P> = (payload: P) => void;

export type AddCallbackType<T extends string[], P extends EventPayloads<T>> = (
  event: keyof EventNames<T>,
  callback: EventCallback<P[typeof event]>
) => string;

export type RemoveCallbackType<T extends string[]> = (
  event: keyof EventNames<T>,
  id: string
) => void;

export type EmitType<T extends string[], P extends EventPayloads<T>> = (
  event: keyof EventNames<T>,
  payload: P[typeof event]
) => void;

export type EventType<P> = {
  payload: P;
};

export interface IEventMessenger<T extends Record<string, EventType<unknown>>> {
  addCallback: <K extends keyof T>(
    event: K,
    callback: (payload: T[K]["payload"]) => void
  ) => string;
  removeCallback: <K extends keyof T>(event: K, id: string) => void;
  emit: <K extends keyof T>(event: K, payload: T[K]["payload"]) => void;
}
