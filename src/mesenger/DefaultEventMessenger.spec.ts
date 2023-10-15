import { DefaultEventMessenger } from "./DefaultEventMessenger";
import { expect, describe, it, vi } from "vitest";

describe("DefaultEventMessenger", () => {
  it("Should add callback and return id", () => {
    const eventMessenger = new DefaultEventMessenger();
    const callback = vi.fn();
    const id = eventMessenger.addCallback("test", callback);

    expect(eventMessenger.callbackMap.test![id]).toBe(callback);
  });

  it("Should remove callback", () => {
    const eventMessenger = new DefaultEventMessenger();

    const id = eventMessenger.addCallback("test", () => {});
    eventMessenger.removeCallback("test", id);

    expect(eventMessenger.callbackMap).toEqual({
      test: {},
    });
  });

  it("Should emit callback for all listeners", () => {
    const eventMessenger = new DefaultEventMessenger();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    eventMessenger.addCallback("test", callback1);
    eventMessenger.addCallback("test", callback2);
    eventMessenger.emit("test");

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  it("Should be able to handle specific event names", () => {
    const eventMessenger = new DefaultEventMessenger<["test", "test2"]>();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    eventMessenger.addCallback("test", callback1);
    eventMessenger.addCallback("test2", callback2);
    eventMessenger.emit("test");

    expect(callback1).toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });
});
