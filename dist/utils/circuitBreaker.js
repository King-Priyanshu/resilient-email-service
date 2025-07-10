"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
class CircuitBreaker {
    constructor() {
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = 0;
        this.threshold = 3;
        this.cooldown = 10000; // 10 seconds
    }
    isAvailable() {
        const now = Date.now();
        return this.failureCount < this.threshold || now - this.lastFailureTime > this.cooldown;
    }
    recordFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
    }
    reset() {
        this.failureCount = 0;
        this.successCount = 0;
    }
}
exports.CircuitBreaker = CircuitBreaker;
