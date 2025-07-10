export class CircuitBreaker {
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private threshold = 3;
  private cooldown = 10000; // 10 seconds

  isAvailable(): boolean {
    const now = Date.now();
    return this.failureCount < this.threshold || now - this.lastFailureTime > this.cooldown;
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
  }

  reset(): void {
    this.failureCount = 0;
    this.successCount = 0;
  }
}