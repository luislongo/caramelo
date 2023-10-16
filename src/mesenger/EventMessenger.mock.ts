import { vi } from "vitest";
import { IEventMessenger } from "./IEventMessenger";

export class EventMessengerMock
  implements IEventMessenger<Record<string, { payload: unknown }>>
{
  addCallback = vi.fn();
  removeCallback = vi.fn();
  emit = vi.fn();
}

export const eventMessengerMock = new EventMessengerMock();
