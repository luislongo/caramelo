import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { EventProvider, EventProviderContext } from "./EventProvider";
import { useContext } from "react";

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
  it("Should emit and receive event", () => {
    const callback = vi.fn();
    const sut = render(
      <EventProvider>
        <Receiver callback={callback} />
        <Emitter />
      </EventProvider>
    );

    sut.getByTestId("emitter-default").click();
    expect(callback).toHaveBeenCalled();
  });

  it("Should be able to emit from different components", () => {
    const callback = vi.fn();
    const sut = render(
      <EventProvider>
        <Receiver callback={callback} />
        <Emitter />
        <Emitter />
      </EventProvider>
    );

    const [first, second] = sut.getAllByTestId("emitter-default");
    first.click();
    second.click();

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("Should be able to receive from different components", () => {
    const callback = vi.fn();
    const sut = render(
      <EventProvider>
        <Receiver callback={callback} />
        <Receiver callback={callback} />
        <Emitter />
      </EventProvider>
    );

    sut.getByTestId("emitter-default").click();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("Should not receive event after unmount", () => {
    const callback = vi.fn();
    const sut = render(
      <EventProvider>
        <Receiver callback={callback} />
        <Emitter />
      </EventProvider>
    );

    sut.getByTestId("emitter-default").click();
    expect(callback).toHaveBeenCalledTimes(1);

    sut.rerender(
      <EventProvider>
        <Emitter />
      </EventProvider>
    );

    sut.getByTestId("emitter-default").click();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("Should be able to emit different events", () => {
    const callback = vi.fn();
    const sut = render(
      <EventProvider>
        <Receiver name="first" callback={callback} />
        <Receiver name="second" callback={callback} />
        <Emitter name="first" />
        <Emitter name="second" />
      </EventProvider>
    );

    sut.getByTestId("emitter-first").click();
    sut.getByTestId("emitter-second").click();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
