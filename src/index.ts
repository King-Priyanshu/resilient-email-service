import express, { Request, Response } from 'express';
import { EmailService, Email } from './EmailService';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));   // html page pe ko chlaya 

const emailService = new EmailService();

app.post('/send', async (req: Request, res: Response) => {
  const { to, subject, body, idempotencyKey } = req.body;

  const emailData: Email = { to, subject, body, idempotencyKey };
  console.log('[REQUEST RECEIVED] Email data:', emailData);

  try {
    const status = await emailService.sendEmail(emailData);
    console.log('[RESPONSE SUCCESS] Status:', status);

    res.status(200).json({
      message: 'Email processing complete.',
      status,
      sentData: emailData,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log('[RESPONSE FAILURE] Error:', errorMessage);

    res.status(500).json({
      error: 'Failed to send email.',
      details: errorMessage,
      attemptedData: emailData,
    });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Email Service is running');
});

app.listen(port, () => {
  console.log(`✅ Email service running at: http://localhost:${port}`);
});
