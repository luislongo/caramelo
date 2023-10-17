import { describe, it, expect, vi } from "vitest";
import { createEventContext } from "./createEventContext";
import { render, waitFor } from "@testing-library/react";
import React, { Context, useContext } from "react";
import { EventType, EmitParams } from "../messenger/Messenger.types";
import { EventProviderContextProps } from "./EventProvider.types";

const Emitter = <
  T extends Record<string, EventType<unknown, unknown>>,
  K extends keyof T
>({
  name,
  context,
  payload,
}: {
  name: K;
  context: Context<EventProviderContextProps<T>>;
  payload: T[K]["payload"] extends Record<string, never>
    ? never
    : T[K]["payload"];
}) => {
  const { emitEvent } = useContext(context);
  const nameString = name as string;
  return (
    <button
      onClick={() => emitEvent(...([name, payload] as EmitParams<T, K>))}
      data-testid={`emitter-${nameString}`}
    >
      Emit {nameString}
    </button>
  );
};

const Receiver = <T extends Record<string, EventType<unknown, unknown>>>({
  name = "default",
  callback = () => null,
  context,
}: {
  name?: string;
  callback?: () => void;
  context: Context<EventProviderContextProps<T>>;
}) => {
  const { useEvent } = useContext(context);

  useEvent(
    name,
    () => {
      callback();
    },
    {}
  );

  return null;
};

describe("createEventContext", () => {
  it("Should create usable context", async () => {
    type EventType = {
      a: {
        payload: string;
        options: Record<string, never>;
      };
    };
    const { EventContext, Provider } = createEventContext<EventType>(
      {} as EventProviderContextProps<EventType>
    );

    expect(EventContext).toBeDefined();
    expect(Provider).toBeDefined();
  });

  it("Should be able to receive from two different contexts", async () => {
    type EventTypeA = {
      a: {
        payload: string;
        options: Record<string, never>;
      };
    };
    type EventTypeB = {
      b: {
        payload: number;
        options: Record<string, never>;
      };
    };

    const { EventContext: EventContextA } = createEventContext<EventTypeA>(
      {} as EventProviderContextProps<EventTypeA>
    );

    const { EventContext: EventContextB } = createEventContext<EventTypeB>(
      {} as EventProviderContextProps<EventTypeB>
    );

    const callbackA = vi.fn();
    const callbackB = vi.fn();

    render(
      <EventContextB.Provider
        value={{ useEvent: callbackB, emitEvent: vi.fn() }}
      >
        <EventContextA.Provider
          value={{ useEvent: callbackA, emitEvent: vi.fn() }}
        >
          <Receiver context={EventContextA} />
          <Receiver context={EventContextB} />
        </EventContextA.Provider>
      </EventContextB.Provider>
    );

    expect(callbackA).toHaveBeenCalled();
    expect(callbackB).toHaveBeenCalled();
  });

  it("should be able to emit to different contexts", async () => {
    type EventTypeA = {
      a: {
        payload: string;
        options: Record<string, never>;
      };
    };
    type EventTypeB = {
      b: {
        payload: number;
        options: Record<string, never>;
      };
    };

    const { EventContext: EventContextA } = createEventContext<EventTypeA>(
      {} as EventProviderContextProps<EventTypeA>
    );

    const { EventContext: EventContextB } = createEventContext<EventTypeB>(
      {} as EventProviderContextProps<EventTypeB>
    );

    const callbackA = vi.fn();
    const callbackB = vi.fn();

    const sut = render(
      <EventContextB.Provider
        value={{ useEvent: vi.fn(), emitEvent: callbackB }}
      >
        <EventContextA.Provider
          value={{ useEvent: vi.fn(), emitEvent: callbackA }}
        >
          <Receiver name="a" context={EventContextA} />
          <Receiver name="b" context={EventContextB} />
          <Emitter name="a" context={EventContextA} payload="a" />
          <Emitter name="b" context={EventContextB} payload={1} />
        </EventContextA.Provider>
      </EventContextB.Provider>
    );

    const emitterA = await sut.findByTestId("emitter-a");
    const emitterB = await sut.findByTestId("emitter-b");

    emitterA.click();
    emitterB.click();

    await waitFor(() => expect(callbackA).toHaveBeenCalled());
    await waitFor(() => expect(callbackB).toHaveBeenCalled());
  });
});
