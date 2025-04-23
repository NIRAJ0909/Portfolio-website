require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for dev; restrict in production!
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'X-Auth-Token']
}));
app.use(express.json());

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        // Optional: Security token check
        if (req.headers['x-auth-token'] !== '1C23E1763400BACA1AC6CB73635FDB6CA714') {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const { name, email, message, phone } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Configure Gmail SMTP transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Compose email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'ninjaniraj760@gmail.com',
            subject: 'New Message from Portfolio Contact Form',
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            error: 'Failed to send message. Please try again later.'
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));