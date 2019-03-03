const path = require('path');
const express = require('express');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(publicPath));



io.on('connection', (socket) => {
  console.log('New WebSocket Connection');
  
  socket.on('message', (message) => {
    io.emit('message', message);
  });
});



server.listen(8000, () => {
  console.log('Server Run in port 8000');
});