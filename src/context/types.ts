export type EventName = string | number | symbol;
export type EventHandler = (...args: any) => void;
export type SubscriptionId = string;

export type EventSubscriberTable = Record<SubscriptionId, EventHandler>;
export type EventTable = Record<EventName, EventSubscriberTable>;

export type EventSubscription<T> = {
  [K in keyof T]: T[K] extends EventHandler | undefined ? T[K] : never
};

export type OptionalParameters<T extends ((...args: any) => any) | undefined> = T extends (...args: infer P) => any ? P : [];
