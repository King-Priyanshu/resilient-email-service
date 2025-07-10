import { Email } from '../EmailService';

export class MockProviderA {
  async send(email: Email): Promise<void> {
    if (Math.random() < 0.7) return;
    throw new Error('MockProviderA failed');
  }
}