import { DefaultEventMessenger } from "./DefaultMessenger";
import { expect, describe, it, vi } from "vitest";

describe("DefaultEventMessenger", () => {
  it("Should add callback and return id", () => {
    const eventMessenger = new DefaultEventMessenger<{
      event_A: {
        payload: {
          message: string;
        };
        options: never;
      };
    }>();

    const callback = vi.fn();
    const id = eventMessenger.addCallback("event_A", callback);

    expect(eventMessenger.callbackMap.event_A![id]).toBe(callback);
  });

  it("Should remove callback", () => {
    const eventMessenger = new DefaultEventMessenger<{
      event_A: {
        payload: string;
        options: never;
      };
    }>();

    const id = eventMessenger.addCallback("event_A", () => {});
    eventMessenger.removeCallback("event_A", id);

    expect(eventMessenger.callbackMap).toEqual({
      event_A: {},
    });
  });

  it("Should emit callback for all listeners", () => {
    const eventMessenger = new DefaultEventMessenger<{
      test: {
        payload: never;
        options: never;
      };
    }>();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    eventMessenger.addCallback("test", callback1);
    eventMessenger.addCallback("test", callback2);
    eventMessenger.emit("test");

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  it("Should be able to handle specific event names", () => {
    const eventMessenger = new DefaultEventMessenger<{
      event_A: {
        payload: never;
        options: never;
      };
      event_B: {
        payload: string;
        options: never;
      };
    }>();
    const callbackA = vi.fn();
    const callbackB = vi.fn();

    eventMessenger.addCallback("event_A", callbackA);
    eventMessenger.addCallback("event_B", callbackB);
    eventMessenger.emit("event_A");

    expect(callbackA).toHaveBeenCalled();
    expect(callbackB).not.toHaveBeenCalled();
  });

  it("Should be able to handle specific event payloads", () => {
    const eventMessenger = new DefaultEventMessenger<{
      event_A: {
        payload: number;
        options: never;
      };
      event_B: {
        payload: string;
        options: never;
      };
    }>();

    const callback = vi.fn();
    eventMessenger.addCallback("event_A", callback);
    eventMessenger.emit("event_A", 1);
    expect(callback).toHaveBeenCalledWith(1);

    eventMessenger.addCallback("event_B", callback);
    eventMessenger.emit("event_B", "test");
    expect(callback).toHaveBeenCalledWith("test");
  });

  it("Should be able to handle specific event options", () => {
    const eventMessenger = new DefaultEventMessenger<{
      event_A: {
        payload: never;
        options: number;
      };
      event_B: {
        payload: never;
        options: string;
      };
    }>();

    const callback = vi.fn();
    eventMessenger.addCallback("event_A", callback, 1);
    eventMessenger.addCallback("event_B", callback, "test");
  });
});
