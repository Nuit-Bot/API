/**
 * Extend this interface via declaration merging to register your module's keys and payload types.
 *
 * @example
 * declare module "@nuit-bot/api" {
 *   interface MessageRegistry {
 *     "moderation:user_banned": { userId: string; guildId: string };
 *   }
 * }
 */
export interface MessageRegistry {}

export type MessageKey = keyof MessageRegistry;
export type MessagePayload<K extends MessageKey> = MessageRegistry[K];

export type Listener<K extends MessageKey> = (
    payload: MessagePayload<K>,
) => void | Promise<void>;
export type PredicateListener = (
    key: string,
    payload: unknown,
) => void | Promise<void>;

/** Call to unsubscribe. Returned by on() and onMatch(). */
export type Unsubscribe = () => void;

export interface MessageBus {
    /** Subscribe to an exact message key. */
    on<K extends MessageKey>(key: K, listener: Listener<K>): Unsubscribe;

    /** Subscribe with a predicate for namespace-level subscriptions e.g. all "moderation:*" events. */
    onMatch(
        predicate: (key: string, payload: unknown) => boolean,
        listener: PredicateListener,
    ): Unsubscribe;

    /** Fire and forget. Listener errors are swallowed and logged. */
    emit<K extends MessageKey>(key: K, payload: MessagePayload<K>): void;
}
