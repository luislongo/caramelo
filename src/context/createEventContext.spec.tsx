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
    const { EventContext, Provider } = createEventContext<EventType>(
      {} as EventProviderContextProps<EventType>
    );

    expect(EventContext).toBeDefined();
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
          <Receiver
            context={EventContextA}
            name="event_A"
            options={{} as never}
          />
          <Receiver
            context={EventContextB}
            name="event_B"
            options={{} as never}
          />
        </EventContextA.Provider>
      </EventContextB.Provider>
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
          <Receiver
            name="event_A"
            context={EventContextA}
            options={{} as never}
          />
          <Receiver
            name="event_B"
            context={EventContextB}
            options={{} as never}
          />
          <Emitter name="event_A" context={EventContextA} payload="a" />
          <Emitter name="event_B" context={EventContextB} payload={1} />
        </EventContextA.Provider>
      </EventContextB.Provider>
    );

    const emitterA = await sut.findByTestId("emitter-event_A");
    const emitterB = await sut.findByTestId("emitter-event_B");

    fireEvent.click(emitterA);
    fireEvent.click(emitterB);

    expect(callbackA).toHaveBeenCalled();
    expect(callbackB).toHaveBeenCalled();
  });
});
