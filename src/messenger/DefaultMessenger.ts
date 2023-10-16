import { v4 as uuid } from "uuid";
import { EventCallback, EventType, IMessenger } from "./Messenger.types";

type CallbackRecord<T extends Record<string, EventType<unknown>>> = {
  [K in keyof T]: Record<string, EventCallback<T[K]["payload"]>>;
};

export class DefaultEventMessenger<
  T extends { [K in keyof T]: EventType<unknown> }
> implements IMessenger<T>
{
  callbackMap: Partial<CallbackRecord<T>> = {};

  addCallback = <K extends keyof T>(
    event: K,
    callback: (payload: T[K]["payload"]) => void
  ): string => {
    const id = uuid();

    if (!this.callbackMap[event]) {
      this.callbackMap[event] = {
        [id]: callback,
      };
    } else {
      this.callbackMap[event] = {
        ...this.callbackMap[event],
        [id]: callback,
      };
    }

    return id;
  };

  removeCallback = <K extends keyof T>(event: K, id: string) => {
    if (this.callbackMap[event]) {
      this.callbackMap[event] && delete this.callbackMap[event]![id];
    }
  };

  emit = <K extends keyof T>(event: K, payload: T[K]["payload"]) => {
    if (this.callbackMap[event]) {
      Object.values(this.callbackMap[event] || []).forEach((callback) =>
        callback(payload)
      );
    }
  };
}
