export class RateLimiter {
  private tokens: number;
  private capacity: number;
  private refillInterval: number;
  private lastRefill: number;

  constructor(capacity: number, refillInterval: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillInterval = refillInterval;
    this.lastRefill = Date.now();
  }

  allowRequest(): boolean {
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