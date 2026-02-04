import * as Sentry from '@sentry/node';
import { Express } from 'express';
import { env } from '../config/env.js';
import { logger } from './logger.js';

let isInitialized = false;

export function initSentry(): void {
    if (!env.SENTRY_DSN) {
        logger.info('Sentry DSN not configured, skipping initialization');
        return;
    }

    if (isInitialized) {
        return;
    }

    Sentry.init({
        dsn: env.SENTRY_DSN,
        environment: env.NODE_ENV,
        tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    });

    isInitialized = true;
    logger.info('Sentry initialized');
}

export function setupSentryErrorHandler(_app: Express): void {
    // No-op for now, Sentry automatically captures errors
    // The error handler middleware in errorHandler.ts will call captureException
    if (!isInitialized) {
        return;
    }
}

export function captureException(error: Error, context?: Record<string, unknown>): void {
    if (!isInitialized) {
        logger.error({ error, context }, 'Error captured (Sentry not initialized)');
        return;
    }

    Sentry.withScope((scope) => {
        if (context) {
            scope.setExtras(context);
        }
        Sentry.captureException(error);
    });
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!isInitialized) {
        logger.info({ message, level }, 'Message captured (Sentry not initialized)');
        return;
    }

    Sentry.captureMessage(message, level);
}

export function setUser(user: { id: string; email?: string; role?: string }): void {
    if (!isInitialized) {
        return;
    }

    Sentry.setUser(user);
}

export function clearUser(): void {
    if (!isInitialized) {
        return;
    }

    Sentry.setUser(null);
}

export { Sentry };
