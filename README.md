# Whatsapp_Bulk_Sender_backend

## 🚀 Features

- **Bulk Messaging**: Send messages to multiple WhatsApp numbers simultaneously  
- **QR Code Authentication**: Generate and serve QR codes for WhatsApp Web authentication  
- **Flutter Integration**: API endpoints specifically designed for Flutter mobile app integration  
- **Rate Limiting**: Built-in 2-second delay between messages to prevent blocking  
- **Number Validation**: Automatic phone number validation and duplicate prevention  
- **Real-time Status**: Monitor connection status and message delivery  
- **RESTful API**: Clean and intuitive REST API endpoints  

---

## 📱 API Endpoints

### Authentication
- `GET /qr-code` - Get QR code for WhatsApp authentication (returns base64 image)  
- `GET /status` - Get current client status and statistics  

### Message Management
- `POST /add-number` - Add single or multiple phone numbers  
- `POST /set-message` - Set the message to be sent  
- `POST /send-all` - Send message to all added numbers  
- `POST /send-media` - Send media message to all added numbers  

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js  
- **WhatsApp Integration**: [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)  
- **QR Code Generation**: `qrcode`, `qrcode-terminal`  
- **Frontend**: Flutter (mobile app)  
- **Authentication**: WhatsApp Web QR Code  

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Whatsapp_Bulk_Sender_backend.git

# Navigate to the project directory
cd Whatsapp_Bulk_Sender_backend

# Install dependencies
npm install

# Start the server
node index.js
```

## 🔧 Usage
Adding Phone Numbers
```bash
# Add single number
curl -X POST http://localhost:3000/add-number \
  -H "Content-Type: application/json" \
  -d '{"number": "+1234567890"}'

# Add multiple numbers
curl -X POST http://localhost:3000/add-number \
  -H "Content-Type: application/json" \
  -d '{"numbers": ["+1234567890", "+0987654321"]}'
```
Setting Message
```bash
curl -X POST http://localhost:3000/set-message \
  -H "Content-Type: application/json" \
  -d '{"msg": "Hello from bulk messenger!"}'
```
Sending Messages
```bash
curl -X POST http://localhost:3000/send-all
```
Sending Media Messages
```bash
curl -X POST http://localhost:3000/send-media
```

Getting QR Code
```bash
curl http://localhost:3000/qr-code
```
## 🔒 Security Features
- Phone number validation and sanitization
- Duplicate number prevention
- WhatsApp registration verification
- Rate limiting to prevent spam
- Graceful error handling

## 📋 Requirements
- Node.js 14+
- npm or yarn
- Active internet connection
- WhatsApp account for QR code scanning

## ⚠️ Important Notes
- This project is for educational and legitimate business use only
- Ensure compliance with WhatsApp’s Terms of Service
- Use responsibly and respect recipients’ privacy
- Test with your own numbers first
- Be aware of WhatsApp's rate limiting policies

## 🤝 Contributing
- Fork the repository
- Create your feature branch: git checkout -b feature/AmazingFeature
- Commit your changes: git commit -m 'Add some AmazingFeature'
- Push to the branch: git push origin feature/AmazingFeature
- Open a Pull Request

## 📞 Support
If you encounter any issues or have questions, please open an issue on GitHub.

---
⭐ Star this repository if you find it helpful!
