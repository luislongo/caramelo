import { render, waitFor } from "@testing-library/react";
import { Context, createContext, useContext } from "react";
import { describe, expect, it, vi } from "vitest";
import { EventProvider } from "./EventProvider";
import { eventMessengerMock } from "../messenger/Messenger.mock";
import { EventProviderContextProps } from "./EventProvider.types";
import React from "react";

const EventProviderContext = createContext<EventProviderContextProps>(
  {} as EventProviderContextProps
);

const Emitter = ({
  name = "default",
  context,
}: {
  name?: string;
  context: Context<EventProviderContextProps>;
}) => {
  const { emitEvent } = useContext(context);

  return (
    <button onClick={() => emitEvent(name, {})} data-testid={`emitter-${name}`}>
      Emit {name}
    </button>
  );
};

const Receiver = ({
  name = "default",
  callback = () => null,
  context,
}: {
  name?: string;
  callback?: () => void;
  context: Context<EventProviderContextProps>;
}) => {
  const { useEvent } = useContext(context);

  useEvent(name, () => {
    callback();
  });

  return null;
};

describe("EventProvider", () => {
  it("Should add callback when receiver is mounted", async () => {
    render(
      <EventProvider
        messenger={eventMessengerMock}
        context={EventProviderContext}
      >
        <Receiver context={EventProviderContext} />
      </EventProvider>
    );

    await waitFor(() =>
      expect(eventMessengerMock.addCallback).toHaveBeenCalled()
    );
  });

  it("Should remove callback when receiver is unmounted", () => {
    const callback = vi.fn();
    const sut = render(
      <EventProvider
        messenger={eventMessengerMock}
        context={EventProviderContext}
      >
        <Receiver callback={callback} context={EventProviderContext} />
      </EventProvider>
    );

    sut.rerender(
      <EventProvider
        messenger={eventMessengerMock}
        context={EventProviderContext}
      >
        <div />
      </EventProvider>
    );

    expect(eventMessengerMock.removeCallback).toHaveBeenCalled();
  });

  it("Should emit event when emitter is clicked", async () => {
    const sut = render(
      <EventProvider
        messenger={eventMessengerMock}
        context={EventProviderContext}
      >
        <Emitter context={EventProviderContext} />
      </EventProvider>
    );

    sut.getByTestId("emitter-default").click();

    await waitFor(() => expect(eventMessengerMock.emit).toHaveBeenCalled());
  });
});
