const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store active sessions
const activeSessions = new Map();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/start-pairing', async (req, res) => {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    const sessionId = `session_${Date.now()}`;
    
    try {
        // Send response immediately
        res.json({ 
            success: true, 
            sessionId: sessionId,
            message: 'Starting pairing process...'
        });
        
        // Start WhatsApp session after sending response
        setTimeout(() => startWhatsAppSession(sessionId, phoneNumber), 100);
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to start pairing' });
    }
});

async function startWhatsAppSession(sessionId, phoneNumber) {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(`auth_${sessionId}`);
        
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            browser: ['Chrome', 'Linux', ''],
            syncFullHistory: false,
            markOnlineOnConnect: false
        });

        activeSessions.set(sessionId, sock);

        // Handle connection updates
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                console.log('QR Code received for session:', sessionId);
                try {
                    const qrDataURL = await QRCode.toDataURL(qr);
                    io.emit('qr-code', { sessionId, qr: qrDataURL });
                    io.emit('status', { sessionId, message: 'QR Code generated. Scan with WhatsApp.' });
                } catch (err) {
                    console.error('QR generation error:', err);
                }
            }

            if (connection === 'open') {
                console.log(`Session ${sessionId} connected!`);
                io.emit('connected', { sessionId });
                io.emit('status', { sessionId, message: 'Connected successfully!' });
            }

            if (connection === 'close') {
                console.log(`Session ${sessionId} closed`);
                activeSessions.delete(sessionId);
                io.emit('disconnected', { sessionId });
            }
        });

        // Handle credentials
        sock.ev.on('creds.update', saveCreds);

        // Request pairing code if phone number provided
        if (phoneNumber && !sock.authState.creds.registered) {
            setTimeout(async () => {
                try {
                    const formattedNumber = phoneNumber.replace(/\D/g, '');
                    console.log('Requesting pairing code for:', formattedNumber);
                    
                    const pairingCode = await sock.requestPairingCode(formattedNumber);
                    
                    // Format the code (add dash every 4 characters)
                    const formattedCode = pairingCode.match(/.{1,4}/g).join('-');
                    
                    console.log('Pairing code generated:', formattedCode);
                    
                    io.emit('pairing-code', { 
                        sessionId, 
                        code: pairingCode,
                        formattedCode: formattedCode
                    });
                    io.emit('status', { 
                        sessionId, 
                        message: 'Pairing code generated! Enter it in WhatsApp.' 
                    });
                } catch (error) {
                    console.error('Pairing code error:', error);
                    io.emit('error', { 
                        sessionId, 
                        message: 'Failed to generate pairing code. Try again.' 
                    });
                }
            }, 2000);
        }

    } catch (error) {
        console.error('Session creation error:', error);
        io.emit('error', { 
            sessionId, 
            message: 'Failed to create session. Check server logs.' 
        });
    }
}

// Clean up old sessions periodically
setInterval(() => {
    const now = Date.now();
    for (const [sessionId, sock] of activeSessions.entries()) {
        // Remove sessions older than 1 hour
        const timestamp = parseInt(sessionId.split('_')[1]);
        if (now - timestamp > 3600000) {
            try {
                sock.end();
            } catch (e) {}
            activeSessions.delete(sessionId);
        }
    }
}, 300000); // Every 5 minutes

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📱 Open your browser and go to http://localhost:${PORT}`);
});
