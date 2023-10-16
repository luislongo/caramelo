export type EventCallback<P> = (payload: P) => void;

export type AddCallbackType<
  T extends Record<string, EventType<unknown>>,
  K extends keyof T
> = (event: K, callback: EventCallback<T[K]["payload"]>) => string;

export type RemoveCallbackType<
  T extends Record<string, EventType<unknown>>,
  K extends keyof T
> = (event: K, id: string) => void;

export type EmitType<
  T extends Record<string, EventType<unknown>>,
  K extends keyof T
> = (event: K, payload: T[K]["payload"]) => void;

export type EventType<P> = {
  payload: P;
};

export interface IMessenger<T extends Record<string, EventType<unknown>>> {
  addCallback: <K extends keyof T>(
    event: K,
    callback: (payload: T[K]["payload"]) => void
  ) => string;
  removeCallback: RemoveCallbackType<T, keyof T>;
  emit: EmitType<T, keyof T>;
}
