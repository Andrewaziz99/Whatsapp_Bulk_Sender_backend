const fs = require('fs');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let phoneNumbers = [];
let message = "";
let qrCodeData = null;
let isClientReady = false;

// WhatsApp client setup
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("Scan the QR code above with your WhatsApp");
    
    // Store QR code data for API
    qrCodeData = qr;
    isClientReady = false;
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
    isClientReady = true;
    qrCodeData = null; // Clear QR code when ready
});

// API to send media message
app.post('/send-media', async (req, res) => {
    const { filePath, caption } = req.body;
    
    if (!filePath) return res.status(400).send("File path is required.");
    if (phoneNumbers.length === 0) return res.status(400).send("No numbers added.");

    try {
        const media = MessageMedia.fromFilePath(filePath);
        
        for (let i = 0; i < phoneNumbers.length; i++) {
            const number = phoneNumbers[i];
            const chatId = `${number}@c.us`;

            const isRegistered = await client.isRegisteredUser(chatId);
            if (!isRegistered) {
                console.log(`Number ${number} is not registered on WhatsApp.`);
                continue;
            }

            await client.sendMessage(chatId, media, { caption: caption || '' });
            console.log(`Media sent to ${number}`);
            res.send(`Media sent to ${number}`);
            
            if (i < phoneNumbers.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        res.send("Media sent to all numbers.");
    } catch (error) {
        console.error('Error sending media:', error);
        res.status(500).send("Failed to send media.");
    }
});

// API to add number
app.post('/add-number', (req, res) => {
    const { number, numbers } = req.body;

    // Handle multiple numbers
    if (Array.isArray(numbers)) {
        const validNumbers = numbers
            .map(n => n.replace(/\D/g, ''))
            .filter(n => n.length > 5 && !phoneNumbers.includes(n)); // simple filter & dedup

        phoneNumbers.push(...validNumbers);
        return res.send(`Added ${validNumbers.length} numbers.`);
    }

    // Handle single number
    if (number) {
        const cleaned = number.replace(/\D/g, '');
        if (cleaned.length < 5) return res.status(400).send("Invalid number.");
        if (!phoneNumbers.includes(cleaned)) {
            phoneNumbers.push(cleaned);
            return res.send(`Number ${cleaned} added.`);
        } else {
            return res.send(`Number ${cleaned} already added.`);
        }
    }

    return res.status(400).send("Provide either 'number' or 'numbers' array.");
});

// API to get QR code for Flutter app
app.get('/qr-code', async (req, res) => {
    if (isClientReady) {
        return res.json({
            status: 'ready',
            message: 'WhatsApp client is ready',
            qrCode: null,
            qrCodeImage: null
        });
    }
    
    if (!qrCodeData) {
        return res.json({
            status: 'loading',
            message: 'QR code not yet generated',
            qrCode: null,
            qrCodeImage: null
        });
    }
    
    try {
        // Generate QR code as base64 image
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);
        
        return res.json({
            status: 'qr_available',
            message: 'QR code available for scanning',
            qrCode: qrCodeData, // Raw QR data
            qrCodeImage: qrCodeImage // Base64 image data
        });
    } catch (error) {
        console.error('Error generating QR code image:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to generate QR code image',
            qrCode: qrCodeData,
            qrCodeImage: null
        });
    }
});

// API to get client status
app.get('/status', (req, res) => {
    res.json({
        isReady: isClientReady,
        hasQrCode: !!qrCodeData,
        phoneNumbersCount: phoneNumbers.length,
        messageSet: !!message
    });
});


// API to set message
app.post('/set-message', (req, res) => {
    const { msg } = req.body;
    if (!msg) return res.status(400).send("Message is required.");
    message = msg;
    res.send("Message set.");
});

// API to send messages
//Delay 2 seconds between messages
app.post('/send-all', async (req, res) => {
    if (!message) return res.status(400).send("Message not set.");
    if (phoneNumbers.length === 0) return res.status(400).send("No numbers added.");

    for (let i = 0; i < phoneNumbers.length; i++) {
        const number = phoneNumbers[i];
        const cleaned = number.replace(/\D/g, '');
        const chatId = `${cleaned}@c.us`;

        const isRegistered = await client.isRegisteredUser(chatId);
        if (!isRegistered) {
            console.log(`Number ${number} is not registered on WhatsApp.`);
            continue;
        }

        await client.sendMessage(chatId, message);
        console.log(`Message sent to ${number}`);
        
        // Add 2-second delay between messages (except for the last message)
        if (i < phoneNumbers.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    console.log("Messages sent to all numbers.");

    res.send("Messages sent.");
});

client.initialize();
app.listen(3000, () => console.log("Server running on port 3000"));
// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log("Shutting down...");
    client.destroy();
    process.exit(0);
});