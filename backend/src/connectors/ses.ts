import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { env } from '../config/env.js';
import { logger } from './logger.js';

const sesClient = new SESClient({
    region: env.AWS_REGION,
    ...(env.AWS_ACCESS_KEY_ID &&
        env.AWS_SECRET_ACCESS_KEY && {
        credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
    }),
});

export interface EmailParams {
    to: string;
    subject: string;
    htmlBody: string;
    textBody?: string;
}

/**
 * Send an email via SES
 */
export async function sendEmail(params: EmailParams): Promise<string | undefined> {
    const { to, subject, htmlBody, textBody } = params;

    const command = new SendEmailCommand({
        Source: env.SES_FROM_EMAIL,
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: 'UTF-8',
            },
            Body: {
                Html: {
                    Data: htmlBody,
                    Charset: 'UTF-8',
                },
                ...(textBody && {
                    Text: {
                        Data: textBody,
                        Charset: 'UTF-8',
                    },
                }),
            },
        },
    });

    try {
        const result = await sesClient.send(command);
        logger.info({ to, subject, messageId: result.MessageId }, 'Email sent successfully');
        return result.MessageId;
    } catch (error) {
        logger.error({ to, subject, error }, 'Failed to send email');
        throw error;
    }
}

/**
 * Send OTP verification email
 */
export async function sendOtpEmail(to: string, otp: string, purpose: 'signup' | 'password_reset'): Promise<string | undefined> {
    const subject = purpose === 'signup'
        ? 'Verify your Eagle Foundry account'
        : 'Reset your Eagle Foundry password';

    const actionText = purpose === 'signup'
        ? 'verify your email address'
        : 'reset your password';

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Eagle Foundry</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937; margin-top: 0;">Your verification code</h2>
        <p>Use this code to ${actionText}:</p>
        <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6366f1;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px; margin-bottom: 0;">
          Eagle Foundry - Ashland University's Startup Incubator & Project Marketplace
        </p>
      </div>
    </body>
    </html>
  `;

    const textBody = `
Eagle Foundry

Your verification code: ${otp}

Use this code to ${actionText}. This code will expire in 10 minutes.

If you didn't request this code, you can safely ignore this email.
  `;

    return sendEmail({ to, subject, htmlBody, textBody });
}

export { sesClient };
