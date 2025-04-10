const express = require('express');
const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');

// Configuração do servidor Express
const app = express();

// Carregar certificados SSL (opcional, Render usa isso automaticamente)
const server = https.createServer(app);

// Criar o WebSocket Server
const wss = new WebSocket.Server({ server });

// Manter os clientes conectados
wss.on('connection', (ws) => {
    console.log('Novo cliente conectado');

    // Enviar uma mensagem de boas-vindas quando um cliente se conectar
    ws.send(JSON.stringify({ message: 'Bem-vindo ao servidor WebSocket!' }));

    // Quando o servidor receber uma mensagem do cliente
    ws.on('message', (message) => {
        console.log('Mensagem recebida: ', message);

        // Lógica para controlar os vídeos
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.action === 'startVideo') {
            // Enviar para todos os outros clientes a URL do vídeo
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        action: 'startVideo',
                        videoUrl: parsedMessage.videoUrl,
                    }));
                }
            });
        }
    });

    // Quando um cliente se desconectar
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

// Configurar o servidor para rodar na porta 8080 ou a porta fornecida pelo Render
server.listen(process.env.PORT || 8080, () => {
    console.log('Servidor WebSocket rodando');
});
