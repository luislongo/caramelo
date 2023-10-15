// type EventPayloads<T extends EventNames> = { [K in keyof T]: unknown };

export type EventNames<T extends string[]> = Record<T[number], string>;

export interface IEventMessenger<T extends string[] = string[]> {
  addCallback(event: keyof EventNames<T>, callback: CallableFunction): string;
  removeCallback(event: keyof EventNames<T>, id: string): void;
  emit(event: keyof EventNames<T>): void;
}
