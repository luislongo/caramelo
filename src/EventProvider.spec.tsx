import { render, waitFor } from "@testing-library/react";
import { useContext } from "react";
import { describe, expect, it, vi } from "vitest";
import { EventProvider, EventProviderContext } from "./EventProvider";
import { eventMessengerMock } from "./mesenger/EventMessenger.mock";

const Emitter = ({ name = "default" }: { name?: string }) => {
  const { emitEvent } = useContext(EventProviderContext);

  return (
    <button onClick={() => emitEvent(name)} data-testid={`emitter-${name}`}>
      Emit {name}
    </button>
  );
};

const Receiver = ({
  name = "default",
  callback = () => null,
}: {
  name?: string;
  callback?: () => void;
}) => {
  const { useEvent } = useContext(EventProviderContext);

  useEvent(name, () => {
    callback();
  });

  return null;
};

describe("EventProvider", () => {
  it("Should add callback when receiver is mounted", async () => {
    render(
      <EventProvider messenger={eventMessengerMock}>
        <Receiver />
      </EventProvider>
    );

    await waitFor(() =>
      expect(eventMessengerMock.addCallback).toHaveBeenCalled()
    );
  });

  it("Should remove callback when receiver is unmounted", () => {
    const callback = vi.fn();
    const sut = render(
      <EventProvider messenger={eventMessengerMock}>
        <Receiver callback={callback} />
      </EventProvider>
    );

    sut.rerender(
      <EventProvider messenger={eventMessengerMock}>
        <div />
      </EventProvider>
    );

    expect(eventMessengerMock.removeCallback).toHaveBeenCalled();
  });

  it("Should emit event when emitter is clicked", async () => {
    const sut = render(
      <EventProvider messenger={eventMessengerMock}>
        <Emitter />
      </EventProvider>
    );

    sut.getByTestId("emitter-default").click();

    await waitFor(() => expect(eventMessengerMock.emit).toHaveBeenCalled());
  });
});
