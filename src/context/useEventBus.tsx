import React, {
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  import {EventHandler, EventName, EventSubscription, EventTable, OptionalParameters, SubscriptionId} from "./types";
  
  interface EventBusState {
    subscribe: (event: EventName, handler: EventHandler) => SubscriptionId;
    unsubscribe: (event: EventName, id: SubscriptionId) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raiseEvent: (event: EventName, ...args: any) => void;
  }

  interface SubscriptionData {
    id: SubscriptionId;
    eventName: EventName;
  }
  
  export const EventBusContext = React.createContext<EventBusState | undefined>(
    undefined,
  );
  
  interface Props {
    createUniqueId: () => string;
  }
  
  export const EventBusProvider = ({
    children,
    createUniqueId,
  }: PropsWithChildren<Props>) => {
    const [subscriptions] = useState<EventTable>({});
  
    const subscribe: EventBusState["subscribe"] = useCallback(
      (name, handler) => {
        let subscribers = subscriptions[name];
        if (!subscribers) {
          subscribers = {};
          subscriptions[name] = subscribers;
        }
  
        const id = createUniqueId();
        subscribers[id] = handler;
  
        return id;
      },
      [subscriptions, createUniqueId],
    );
  
    const unsubscribe: EventBusState["unsubscribe"] = useCallback(
      (eventName, id) => {
        const subscribers = subscriptions[eventName];
        if (!subscribers) {
          return;
        }
  
        delete subscribers[id];
      },
      [subscriptions],
    );
  
    const raiseEvent: EventBusState["raiseEvent"] = useCallback(
      (eventName, args) => {
        const eventSubscribers = subscriptions[eventName];
        if (!eventSubscribers) {
            return;
        }

        Object.values(eventSubscribers).forEach(eventHandler => {
          eventHandler?.(args);
        });
      },
      [subscriptions],
    );
  
    const context = useMemo(
      () => ({
        raiseEvent,
        subscribe,
        unsubscribe,
      }),
      [raiseEvent, subscribe, unsubscribe],
    );
  
    return (
      <EventBusContext.Provider value={context}>
        {children}
      </EventBusContext.Provider>
    );
  };
  
  export function useEventBus<S>(
    subscriptions?: EventSubscription<S>,
  ) {
    const context = useContext(EventBusContext);
  
    useEffect(() => {
      if (!context || !subscriptions) {
        return;
      }
  
      const {subscribe, unsubscribe} = context;
  
      const subscriptionsData: SubscriptionData[] = [];
      Object.keys(subscriptions).forEach(eventName => {
        const key = eventName as keyof S;
        const eventHandler = subscriptions[key];
        if (!eventHandler) {
          return;
        }

        const id = subscribe(eventName, eventHandler);
  
        subscriptionsData.push({
          eventName,
          id,
        });
      });
  
      return () => {
        subscriptionsData.forEach(({id, eventName}) =>
          unsubscribe(eventName, id),
        );
      }
    }, [subscriptions, context]);

    const raiseEvent = useCallback(
      (eventName: keyof S, ...args: OptionalParameters<EventSubscription<S>[keyof S]>) => {
        context?.raiseEvent(eventName, ...(args ?? []));
      },
      [context],
    );
  
    return {
      raiseEvent,
    };
  }
  