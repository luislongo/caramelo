# Caramelo

<P align="center">
  <img src="./caramelo.png" alt="Exemplo imagem" width="200">
</p>

> Lightweight event messaging for React

## ✅ Features

- Custom event names, payloads and options
- Scrict typing for event emission and reception
- Customizable event register and emission

## 💻 Install

```
npm i @luislongo/caramelo
```

```
yarn add @luislongo/caramelo
```

## 🚀 Quickstart

The first thing to do is creating event types. In the example below, we are creating three events: `OnLoadStart`, `OnLoadUpdate` and `OnLoadEnd`.

```
type OnLoadStart = {
  payload: never;
  options: never;
};

type OnLoadUpdate = {
  payload: number;
  options: never;
};

type OnLoadEnd = {
  payload: {
    success: boolean;
  };
  options: {
    success: boolean;
  };
};
```

- `payload`: defines the object to be sent when event is emitted;
- `options`: defines an options object to be sent by event receiver in order to customize event register;

`payload` and `options` should be set to `never` if they are not present in the event.

Once event types have been defined, `createEventContext` is used to create the event context. In order to do that, create a new type `EventType` which maps event keys to its corresponding types.

```
type EventType = {
  onLoadStart: OnLoadStart;
  onLoadUpdate: OnLoadUpdate;
  onLoadEnd: OnLoadEnd;
}

const { Context, Provider } = createEventContext<EventType>(
   {} as EventProviderContextProps<EventType>
   );

```

Finally, `Provider` should be added to the DOM

```
<Provider context={Context}>
   ...
</Provider>
```

Events can then be emitted and received as follows:

```
const Emitter = () => {
  const { emitEvent } = useContext(Context);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    emitEvent("onLoadStart");

    return () => {
      emitEvent("onLoadEnd", { success: true });
    }
  }, []);

  useEffect(() => {
    emitEvent("onLoadUpdate", progress);
  }, [progress]);

  return <div />;
};
```

```
const Receiver = () => {
  const { useEvent } = useContext(Context);

  useEvent("onLoadStart", () => {
    console.log("Loading started");
  });

  useEvent("onLoadUpdate", (progress) => {
    console.log("Loading updated", progress);
  });

  useEvent(
    "onLoadEnd",
    (success) => {
      console.log("Loading ended", success);
    },
    {
      success: true,
    }
  );

  return <div />;
};
```

## ⚙️ Customizing event emission

By default, event emission uses a simple id register which does not take into account the `options` object. In order to use it, you will have to create a new messenger class implementing
the `IMessenger` interface. The interface provides three methods:

- `addCallback: <K extends keyof T>(...[event, callback]: AddCallbackParams<T, K>) => string`;
- `removeCallback: <K extends keyof T>(event: K, id: string) => void`;
- `emit: <K extends keyof T>(...[event, payload]: EmitParams<T, K>)`;

This allows you to implement your own register/emission solution, so functionality can be expanded on. A good example of this custom implementation scenario is an input listener. You may have a `onKeyPressed` listener with a `keyCode` option. Emit function could then match listeners with the correct `keyCode` in their options.
