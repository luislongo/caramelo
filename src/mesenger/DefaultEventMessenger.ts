import { EventNames, IEventMessenger } from "./IEventMessenger";
import { v4 as uuid } from "uuid";

export class DefaultEventMessenger<T extends string[]>
  implements IEventMessenger<T>
{
  callbackMap: Partial<
    Record<keyof EventNames<T>, Record<string, CallableFunction>>
  > = {};

  addCallback(event: keyof EventNames<T>, callback: CallableFunction): string {
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
  }

  removeCallback(event: keyof EventNames<T>, id: string): void {
    if (this.callbackMap[event]) {
      this.callbackMap[event] && delete this.callbackMap[event]![id];
    }
  }

  emit(event: keyof EventNames<T>): void {
    if (this.callbackMap[event]) {
      Object.values(this.callbackMap[event] || []).forEach((callback) =>
        callback()
      );
    }
  }
}
