import { z } from 'zod';

const envSchema = z.object({
    // Server
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('3000'),
    CORS_ORIGINS: z.string().transform((s) => s.split(',')).default('http://localhost:3000'),

    // Database
    DATABASE_URL: z.string().url(),

    // JWT
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

    // Email Domain Rules
    STUDENT_EMAIL_DOMAIN: z.string().default('ashland.edu'),
    BLOCKED_EMAIL_DOMAINS: z.string().transform((s) => s.split(',')).default('gmail.com,yahoo.com,outlook.com,hotmail.com,icloud.com,proton.me'),

    // OTP Configuration
    OTP_TTL_MINUTES: z.string().transform(Number).default('10'),
    OTP_MAX_ATTEMPTS: z.string().transform(Number).default('5'),
    OTP_RESEND_COOLDOWN_SECONDS: z.string().transform(Number).default('60'),
    OTP_SEND_LIMIT_PER_HOUR: z.string().transform(Number).default('5'),
    OTP_HASH_PEPPER: z.string().min(16),

    // AWS
    AWS_REGION: z.string().default('us-east-1'),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    S3_BUCKET_NAME: z.string(),
    SES_FROM_EMAIL: z.string().email(),
    SQS_EVENTS_QUEUE_URL: z.string().url(),

    // Sentry
    SENTRY_DSN: z.string().optional(),
});

function loadEnv() {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error('Invalid environment variables:');
        console.error(parsed.error.flatten().fieldErrors);
        process.exit(1);
    }

    return parsed.data;
}

export const env = loadEnv();

export type Env = z.infer<typeof envSchema>;
