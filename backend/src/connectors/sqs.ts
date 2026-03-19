import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env.js';
import { logger } from './logger.js';

const hasExplicitCredentials = !!(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY);

const sqsClient = new SQSClient({
    region: env.AWS_REGION,
    ...(hasExplicitCredentials && {
        credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
        },
    }),
});

logger.info(
    {
        region: env.AWS_REGION,
        queueUrl: env.SQS_EVENTS_QUEUE_URL,
        credentialSource: hasExplicitCredentials ? 'explicit' : 'default-chain',
    },
    'SQS client initialized'
);

export interface EventEnvelope<T = unknown> {
    eventId: string;
    type: string;
    occurredAt: string;
    payload: T;
}

/**
 * Publish an event to the SQS queue
 */
export async function publishEvent<T>(
    type: string,
    payload: T
): Promise<string> {
    const eventId = uuidv4();
    const envelope: EventEnvelope<T> = {
        eventId,
        type,
        occurredAt: new Date().toISOString(),
        payload,
    };

    const command = new SendMessageCommand({
        QueueUrl: env.SQS_EVENTS_QUEUE_URL,
        MessageBody: JSON.stringify(envelope),
        MessageAttributes: {
            eventType: {
                DataType: 'String',
                StringValue: type,
            },
            eventId: {
                DataType: 'String',
                StringValue: eventId,
            },
        },
    });

    try {
        const result = await sqsClient.send(command);
        logger.info(
            { eventId, type, messageId: result.MessageId },
            'Event published to SQS'
        );
        return eventId;
    } catch (err: unknown) {
        const errObj = err instanceof Error ? err : new Error(String(err));
        logger.error(
            {
                eventId,
                type,
                queueUrl: env.SQS_EVENTS_QUEUE_URL,
                region: env.AWS_REGION,
                errorName: errObj.name,
                errorMessage: errObj.message,
            },
            'Failed to publish event to SQS'
        );
        throw errObj;
    }
}

/**
 * Publish multiple events in sequence
 */
export async function publishEvents<T>(
    events: Array<{ type: string; payload: T }>
): Promise<string[]> {
    const eventIds: string[] = [];

    for (const event of events) {
        const eventId = await publishEvent(event.type, event.payload);
        eventIds.push(eventId);
    }

    return eventIds;
}

export { sqsClient };
