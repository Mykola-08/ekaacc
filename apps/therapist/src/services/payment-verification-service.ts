import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export interface PaymentVerificationResult {
  isValid: boolean;
  confidence: number;
  detectedAmount?: number;
  detectedCurrency?: string;
  detectedDate?: string;
  detectedRecipient?: string;
  issues: string[];
  rawText?: string;
}

export class PaymentVerificationService {
  private model = openai('gpt-4-turbo');

  async verifyPaymentProof(
    imageUrl: string,
    expectedAmount: number,
    expectedCurrency: string = 'EUR'
  ): Promise<PaymentVerificationResult> {
    try {
      const { object } = await generateObject({
        model: this.model,
        schema: z.object({
          isValid: z.boolean().describe('Whether the image is a valid payment proof matching the criteria'),
          confidence: z.number().min(0).max(1).describe('Confidence score between 0 and 1'),
          detectedAmount: z.number().optional().describe('The amount detected in the image'),
          detectedCurrency: z.string().optional().describe('The currency detected in the image'),
          detectedDate: z.string().optional().describe('The date detected in the image'),
          detectedRecipient: z.string().optional().describe('The recipient name or number detected'),
          issues: z.array(z.string()).describe('List of issues found (e.g. wrong amount, old date, blurry)'),
          rawText: z.string().optional().describe('Extracted text from the image for debugging'),
        }),
        messages: [
          {
            role: 'system',
            content: `You are a payment verification AI. Your job is to analyze screenshots of payment confirmations (e.g., Bizum, Bank Transfer, PayPal).
            Verify that the payment matches the expected amount: ${expectedAmount} ${expectedCurrency}.
            Check for:
            1. Correct amount.
            2. Recent date (today or very recent).
            3. Status is "Success", "Completed", or similar.
            4. Image is legible.
            
            If the amount is slightly different (e.g. fees), note it but might still be valid if close.
            If the currency is missing, assume EUR if it looks like a European app (Bizum).`
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Please verify this payment proof.' },
              { type: 'image', image: imageUrl }
            ]
          }
        ]
      });

      return object;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return {
        isValid: false,
        confidence: 0,
        issues: ['AI verification failed: ' + (error instanceof Error ? error.message : 'Unknown error')]
      };
    }
  }
}

export const paymentVerificationService = new PaymentVerificationService();
