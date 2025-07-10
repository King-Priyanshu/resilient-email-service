import { Email } from '../EmailService';

export class MockProviderB {
  async send(email: Email): Promise<void> {
    if (Math.random() < 0.5) return;
    throw new Error('MockProviderB failed');
  }
}