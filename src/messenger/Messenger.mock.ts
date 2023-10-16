import { vi } from "vitest";
import { IMessenger } from "./Messenger.types";

export class MessengerMock
  implements IMessenger<Record<string, { payload: unknown }>>
{
  addCallback = vi.fn();
  removeCallback = vi.fn();
  emit = vi.fn();
}

export const eventMessengerMock = new MessengerMock();
