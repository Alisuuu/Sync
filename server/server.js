const express = require('express');
const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');

const app = express();
const server = https.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public')); // Serve static files from the "public" folder

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.action === 'startVideo') {
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        action: 'startVideo',
                        videoUrl: parsedMessage.videoUrl,
                    }));
                }
            });
        }

        if (parsedMessage.action === 'sendMessage') {
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        action: 'receiveMessage',
                        message: parsedMessage.message,
                    }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(process.env.PORT || 8080, () => {
    console.log('WebSocket server running');
});
