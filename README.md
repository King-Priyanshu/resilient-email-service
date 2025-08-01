# Email Sending Service

## Features
- Retry with exponential backoff
- Fallback between providers
- Idempotency
- Rate limiting
- Circuit breaker pattern
- Status tracking
- Mock email providers

## Setup
```bash
npm install
npm run start
```

## Testing
```bash
npm test
```

## Endpoint
POST /send
```json
{
  "to": "user@example.com",
  "subject": "Test",
  "body": "This is a test email.",
  "idempotencyKey": "unique_key_123"
}
```

## Assumptions
- All email send requests must include a unique idempotency key.
- Providers randomly fail to simulate real-world behavior.

---

Created by Priyansh#   r e s i l i e n t - e m a i l - s e r v i c e 
 
 
