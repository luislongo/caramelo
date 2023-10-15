export interface IEventMessenger {
  addCallback(event: string, callback: CallableFunction): string;
  removeCallback(event: string, id: string): void;
  emit(event: string): void;
}
