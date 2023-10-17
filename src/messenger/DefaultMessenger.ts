import { v4 as uuid } from "uuid";
import {
  AddCallbackParams,
  EmitParams,
  EventCallback,
  EventType,
  IMessenger,
} from "./Messenger.types";

type CallbackRecord<T extends Record<string, EventType<unknown, unknown>>> = {
  [K in keyof T]: Record<string, EventCallback<T[K]["payload"]>>;
};

export class DefaultEventMessenger<
  T extends { [K in keyof T]: EventType<unknown, unknown> }
> implements IMessenger<T>
{
  callbackMap: Partial<CallbackRecord<T>> = {};

  addCallback = <K extends keyof T>(
    ...[event, callback]: AddCallbackParams<T, K>
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

  emit = <K extends keyof T>(...[event, payload]: EmitParams<T, K>) => {
    if (this.callbackMap[event]) {
      Object.values(this.callbackMap[event] || []).forEach((callback) =>
        callback(payload)
      );
    }
  };
}
