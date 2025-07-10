"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = require("../src/EmailService");
describe('EmailService', () => {
    const emailService = new EmailService_1.EmailService();
    const email = {
        to: 'test@example.com',
        subject: 'Hello',
        body: 'Test email',
        idempotencyKey: 'abc123'
    };
    it('should send email successfully', async () => {
        const status = await emailService.sendEmail(email);
        expect(status).toMatch(/sent_via_provider_/);
    });
    it('should not send duplicate emails', async () => {
        const status = await emailService.sendEmail(email);
        expect(status).toBe('duplicate');
    });
});
