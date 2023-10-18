import { fireEvent, render } from "@testing-library/react";
import { Context, useContext } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  AddCallbackParams,
  EmitParams,
  EventType,
} from "../messenger/Messenger.types";
import { EventProviderContextProps } from "./EventProvider.types";
import { createEventContext } from "./createEventContext";

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

const Receiver = <
  T extends Record<string, EventType<unknown, unknown>>,
  K extends keyof T
>({
  name,
  callback = vi.fn(),
  context,
  options,
}: {
  name: K;
  context: Context<EventProviderContextProps<T>>;
  callback?: () => void;
  options: T[K]["options"] extends never ? never : T[K]["options"];
}) => {
  const { useEvent } = useContext(context);

  useEvent<K>(
    ...([name, callback, options] as unknown as AddCallbackParams<T, K>)
  );

  return null;
};

describe("createEventContext", () => {
  it("Should create usable context", async () => {
    type EventType = {
      event: {
        payload: string;
        options: never;
      };
    };
    const { Context, Provider } = createEventContext<EventType>(
      {} as EventProviderContextProps<EventType>
    );

    expect(Context).toBeDefined();
    expect(Provider).toBeDefined();
  });

  it("Should be able to receive from two different contexts", async () => {
    type EventTypeA = {
      event_A: {
        payload: string;
        options: never;
      };
    };
    type EventTypeB = {
      event_B: {
        payload: number;
        options: never;
      };
    };

    const { Context: ContextA } = createEventContext<EventTypeA>(
      {} as EventProviderContextProps<EventTypeA>
    );

    const { Context: ContextB } = createEventContext<EventTypeB>(
      {} as EventProviderContextProps<EventTypeB>
    );

    const callbackA = vi.fn();
    const callbackB = vi.fn();

    render(
      <ContextB.Provider value={{ useEvent: callbackB, emitEvent: vi.fn() }}>
        <ContextA.Provider value={{ useEvent: callbackA, emitEvent: vi.fn() }}>
          <Receiver context={ContextA} name="event_A" options={{} as never} />
          <Receiver context={ContextB} name="event_B" options={{} as never} />
        </ContextA.Provider>
      </ContextB.Provider>
    );

    expect(callbackA).toHaveBeenCalled();
    expect(callbackB).toHaveBeenCalled();
  });

  it("should be able to emit to different contexts", async () => {
    type EventTypeA = {
      event_A: {
        payload: string;
        options: never;
      };
    };
    type EventTypeB = {
      event_B: {
        payload: number;
        options: never;
      };
    };

    const { Context: ContextA } = createEventContext<EventTypeA>(
      {} as EventProviderContextProps<EventTypeA>
    );

    const { Context: ContextB } = createEventContext<EventTypeB>(
      {} as EventProviderContextProps<EventTypeB>
    );

    const callbackA = vi.fn();
    const callbackB = vi.fn();

    const sut = render(
      <ContextB.Provider value={{ useEvent: vi.fn(), emitEvent: callbackB }}>
        <ContextA.Provider value={{ useEvent: vi.fn(), emitEvent: callbackA }}>
          <Receiver name="event_A" context={ContextA} options={{} as never} />
          <Receiver name="event_B" context={ContextB} options={{} as never} />
          <Emitter name="event_A" context={ContextA} payload="a" />
          <Emitter name="event_B" context={ContextB} payload={1} />
        </ContextA.Provider>
      </ContextB.Provider>
    );

    const emitterA = await sut.findByTestId("emitter-event_A");
    const emitterB = await sut.findByTestId("emitter-event_B");

    fireEvent.click(emitterA);
    fireEvent.click(emitterB);

    expect(callbackA).toHaveBeenCalled();
    expect(callbackB).toHaveBeenCalled();
  });
});
