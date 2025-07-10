"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProviderB = void 0;
class MockProviderB {
    async send(email) {
        if (Math.random() < 0.5)
            return;
        throw new Error('MockProviderB failed');
    }
}
exports.MockProviderB = MockProviderB;
