import { publishEvent } from '../connectors/sqs.js';
import { logger } from '../connectors/logger.js';
import { EventPayload } from './eventTypes.js';

const CRITICAL_EVENT_PREFIXES = ['email.'];

function isCriticalEvent(type: string): boolean {
    return CRITICAL_EVENT_PREFIXES.some((prefix) => type.startsWith(prefix));
}

/**
 * Publish an event to SQS for async processing.
 * Critical events (e.g. email.*) will throw on failure so callers
 * can surface the error. Non-critical events are best-effort.
 */
export async function publish<T extends EventPayload>(
    type: string,
    payload: T
): Promise<string> {
    try {
        const eventId = await publishEvent(type, payload);
        logger.info({ eventId, type }, 'Event published');
        return eventId;
    } catch (error) {
        logger.error({ type, error }, 'Failed to publish event');

        if (isCriticalEvent(type)) {
            throw error;
        }

        return '';
    }
}

/**
 * Publish multiple events
 */
export async function publishMany(
    events: Array<{ type: string; payload: EventPayload }>
): Promise<string[]> {
    const eventIds: string[] = [];

    for (const event of events) {
        const eventId = await publish(event.type, event.payload);
        eventIds.push(eventId);
    }

    return eventIds;
}
