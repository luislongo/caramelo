import { DefaultEventMessenger } from "./DefaultMessenger";
import { expect, describe, it, vi } from "vitest";

describe("DefaultEventMessenger", () => {
  it("Should add callback and return id", () => {
    const eventMessenger = new DefaultEventMessenger<{
      test: {
        payload: {
          message: string;
        };
        options: never;
      };
    }>();

    const callback = vi.fn();
    const id = eventMessenger.addCallback("test", callback);

    expect(eventMessenger.callbackMap.test![id]).toBe(callback);
  });

  it("Should remove callback", () => {
    const eventMessenger = new DefaultEventMessenger<{
      test: {
        payload: {
          message: string;
        };
        options: never;
      };
    }>();

    const id = eventMessenger.addCallback("test", () => {});
    eventMessenger.removeCallback("test", id);

    expect(eventMessenger.callbackMap).toEqual({
      test: {},
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
      test: {
        payload: never;
        options: never;
      };
      test2: {
        payload: string;
        options: never;
      };
    }>();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    eventMessenger.addCallback("test", callback1);
    eventMessenger.addCallback("test2", callback2);
    eventMessenger.emit("test");

    expect(callback1).toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });

  it("Should be able to handle specific event payloads", () => {
    const eventMessenger = new DefaultEventMessenger<{
      testA: {
        payload: number;
        options: never;
      };
      testB: {
        payload: string;
        options: never;
      };
    }>();

    const callback = vi.fn();
    eventMessenger.addCallback("testA", callback);
    eventMessenger.emit("testA", 1);
    expect(callback).toHaveBeenCalledWith(1);

    eventMessenger.addCallback("testB", callback);
    eventMessenger.emit("testB", "test");
    expect(callback).toHaveBeenCalledWith("test");
  });

  it("Should be able to handle specific event options", () => {
    const eventMessenger = new DefaultEventMessenger<{
      testA: {
        payload: never;
        options: number;
      };
      testB: {
        payload: never;
        options: string;
      };
    }>();

    const callback = vi.fn();
    eventMessenger.addCallback("testA", callback, 1);
    eventMessenger.addCallback("testB", callback, "test");
  });
});
