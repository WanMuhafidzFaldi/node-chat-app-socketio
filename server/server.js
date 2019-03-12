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

  socket.on('sendLocation', (coords) => {
    io.emit('message', `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`);
  });
  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left');
  });
});



server.listen(8000, () => {
  console.log('Server Run in port 8000');
});