"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryWithBackoff = retryWithBackoff;
async function retryWithBackoff(fn, retries = 3, delay = 500) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        }
        catch (e) {
            if (i === retries)
                throw e;
            await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
        }
    }
}
