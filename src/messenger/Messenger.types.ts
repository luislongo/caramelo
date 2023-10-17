export type EventType<P, O> = {
  payload: P;
  options: O;
};

export type EventCallback<P> = (payload: P) => void;

export type AddCallbackType<
  T extends Record<string, EventType<unknown, unknown>>,
  K extends keyof T
> = (
  event: K,
  callback: EventCallback<T[K]["payload"]>,
  options: T[K]["options"]
) => string;

export type RemoveCallbackType<
  T extends Record<string, EventType<unknown, unknown>>,
  K extends keyof T
> = (event: K, id: string) => void;

export type EmitType<
  T extends Record<string, EventType<unknown, unknown>>,
  K extends keyof T
> = (event: K, payload: T[K]["payload"]) => void;

export interface IMessenger<
  T extends Record<string, EventType<unknown, unknown>>
> {
  addCallback: AddCallbackType<T, keyof T>;
  removeCallback: RemoveCallbackType<T, keyof T>;
  emit: EmitType<T, keyof T>;
}
