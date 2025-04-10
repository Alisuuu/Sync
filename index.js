const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log('Usuário conectado');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('video change', (url) => {
    socket.broadcast.emit('video change', url);
  });

  socket.on('play', () => {
    socket.broadcast.emit('play');
  });

  socket.on('pause', () => {
    socket.broadcast.emit('pause');
  });

  socket.on('sync time', (time) => {
    socket.broadcast.emit('sync time', time);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});