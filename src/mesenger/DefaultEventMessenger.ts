import { IEventMessenger } from "./IEventMessenger";
import { v4 as uuid } from "uuid";

export class DefaultEventMessenger implements IEventMessenger {
  callbackMap: Record<string, Record<string, CallableFunction>> = {};

  addCallback(event: string, callback: CallableFunction): string {
    const id = uuid();

    if (!this.callbackMap[event]) {
      this.callbackMap[event] = {};
    }
    this.callbackMap[event][id] = callback;
    return id;
  }

  removeCallback(event: string, id: string): void {
    if (this.callbackMap[event]) {
      delete this.callbackMap[event][id];
    }
  }

  emit(event: string): void {
    if (this.callbackMap[event]) {
      Object.values(this.callbackMap[event]).forEach((callback) => callback());
    }
  }
}
