"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(capacity, refillInterval) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillInterval = refillInterval;
        this.lastRefill = Date.now();
    }
    allowRequest() {
        const now = Date.now();
        const elapsed = now - this.lastRefill;
        if (elapsed > this.refillInterval) {
            this.tokens = this.capacity;
            this.lastRefill = now;
        }
        if (this.tokens > 0) {
            this.tokens--;
            return true;
        }
        return false;
    }
}
exports.RateLimiter = RateLimiter;
