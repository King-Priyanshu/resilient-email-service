"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmailService_1 = require("./EmailService");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public'))); // html page pe ko chlaya 
const emailService = new EmailService_1.EmailService();
app.post('/send', async (req, res) => {
    const { to, subject, body, idempotencyKey } = req.body;
    const emailData = { to, subject, body, idempotencyKey };
    console.log('[REQUEST RECEIVED] Email data:', emailData);
    try {
        const status = await emailService.sendEmail(emailData);
        console.log('[RESPONSE SUCCESS] Status:', status);
        res.status(200).json({
            message: 'Email processing complete.',
            status,
            sentData: emailData,
        });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.log('[RESPONSE FAILURE] Error:', errorMessage);
        res.status(500).json({
            error: 'Failed to send email.',
            details: errorMessage,
            attemptedData: emailData,
        });
    }
});
app.get('/', (req, res) => {
    res.send('Email Service is running');
});
app.listen(port, () => {
    console.log(`✅ Email service running at: http://localhost:${port}`);
});
