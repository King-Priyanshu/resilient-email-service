import { retryWithBackoff } from './utils/retry';
import { CircuitBreaker } from './utils/circuitBreaker';
import { RateLimiter } from './utils/rateLimiter';
import { MockProviderA } from './providers/MockProviderA';
import { MockProviderB } from './providers/MockProviderB';


export interface Email {
  to: string;
  subject: string;
  body: string;
  idempotencyKey: string;
}

export class EmailService {
  private providers = [new MockProviderA(), new MockProviderB()];
  private idempotencyCache = new Map<string, string>();
  private circuitBreakers = [new CircuitBreaker(), new CircuitBreaker()];
  private rateLimiters = [new RateLimiter(5, 60000), new RateLimiter(5, 60000)];

async sendEmail(email: Email): Promise<string> {
  if (this.idempotencyCache.has(email.idempotencyKey)) {
    console.log(`[DUPLICATE] Email with idempotencyKey: ${email.idempotencyKey}`);
    return 'duplicate';
  }

  for (let i = 0; i < this.providers.length; i++) {
    const provider = this.providers[i];
    const circuit = this.circuitBreakers[i];
    const limiter = this.rateLimiters[i];

    if (!circuit.isAvailable()) {
      console.log(`[SKIPPED] Provider ${i + 1} circuit is open.`);
      continue;
    }

    if (!limiter.allowRequest()) {
      console.log(`[RATE LIMITED] Provider ${i + 1} hit rate limit.`);
      continue;
    }

    try {
      console.log(`[ATTEMPT] Sending via Provider ${i + 1}...`);
      await retryWithBackoff(() => provider.send(email), 3);
      this.idempotencyCache.set(email.idempotencyKey, 'sent');
      console.log(`[SUCCESS] Email sent via Provider ${i + 1}`);
      console.log(`[EMAIL DATA]`, email);
      return `sent_via_provider_${i + 1}`;
      
    } catch (err) {
      circuit.recordFailure();
      console.log(`[FAILURE] Provider ${i + 1} failed. Error: ${(err as Error).message}`);
    }
  }

  console.log(`[ERROR] All providers failed for idempotencyKey: ${email.idempotencyKey}`);
  throw new Error('All providers failed');
}

}