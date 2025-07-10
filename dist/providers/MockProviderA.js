"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProviderA = void 0;
class MockProviderA {
    async send(email) {
        if (Math.random() < 0.7)
            return;
        throw new Error('MockProviderA failed');
    }
}
exports.MockProviderA = MockProviderA;
