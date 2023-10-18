import { v4 as uuid } from "uuid";
import {
  AddCallbackParams,
  EmitParams,
  EventCallback,
  EventCallbackParams,
  EventType,
  IMessenger,
} from "./Messenger.types";

type CallbackRecord<T extends Record<string, EventType<unknown, unknown>>> = {
  [K in keyof T]: Record<string, EventCallback<T, K>>;
};

export class DefaultEventMessenger<
  T extends { [K in keyof T]: EventType<unknown, unknown> }
> implements IMessenger<T>
{
  callbackMap: Partial<CallbackRecord<T>> = {};

  addCallback = <K extends keyof T>(
    ...[name, callback]: AddCallbackParams<T, K>
  ): string => {
    const id = uuid();

    if (!this.callbackMap[name]) {
      this.callbackMap[name] = {
        [id]: callback,
      };
    } else {
      this.callbackMap[name] = {
        ...this.callbackMap[name],
        [id]: callback,
      };
    }

    return id;
  };

  removeCallback = <K extends keyof T>(name: K, id: string) => {
    if (this.callbackMap[name]) {
      this.callbackMap[name] && delete this.callbackMap[name]![id];
    }
  };

  emit = <K extends keyof T>(...[name, payload]: EmitParams<T, K>) => {
    if (this.callbackMap[name]) {
      Object.values(this.callbackMap[name] || []).forEach((callback) =>
        callback(...([payload] as EventCallbackParams<T, K>))
      );
    }
  };
}
