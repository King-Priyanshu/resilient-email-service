"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const retry_1 = require("./utils/retry");
const circuitBreaker_1 = require("./utils/circuitBreaker");
const rateLimiter_1 = require("./utils/rateLimiter");
const MockProviderA_1 = require("./providers/MockProviderA");
const MockProviderB_1 = require("./providers/MockProviderB");
class EmailService {
    constructor() {
        this.providers = [new MockProviderA_1.MockProviderA(), new MockProviderB_1.MockProviderB()];
        this.idempotencyCache = new Map();
        this.circuitBreakers = [new circuitBreaker_1.CircuitBreaker(), new circuitBreaker_1.CircuitBreaker()];
        this.rateLimiters = [new rateLimiter_1.RateLimiter(5, 60000), new rateLimiter_1.RateLimiter(5, 60000)];
    }
    async sendEmail(email) {
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
                await (0, retry_1.retryWithBackoff)(() => provider.send(email), 3);
                this.idempotencyCache.set(email.idempotencyKey, 'sent');
                console.log(`[SUCCESS] Email sent via Provider ${i + 1}`);
                console.log(`[EMAIL DATA]`, email);
                return `sent_via_provider_${i + 1}`;
            }
            catch (err) {
                circuit.recordFailure();
                console.log(`[FAILURE] Provider ${i + 1} failed. Error: ${err.message}`);
            }
        }
        console.log(`[ERROR] All providers failed for idempotencyKey: ${email.idempotencyKey}`);
        throw new Error('All providers failed');
    }
}
exports.EmailService = EmailService;
