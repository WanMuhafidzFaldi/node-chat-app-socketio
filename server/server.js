const path = require('path');
const express = require('express');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const socketio = require('socket.io');
const badWords = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(publicPath));



io.on('connection', (socket) => {
  console.log('New WebSocket Connection');

  socket.emit('message', 'Welcome');
  socket.broadcast.emit('message', 'New User Joined');

  socket.on('sendLocation', (coords, callback) => {
    io.emit('message', `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`);
    return callback({message : 'Message Delivered'});
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new badWords();
    
    if(filter.isProfane(message)){
      return callback({err : true, message : 'Your Words Not Allowed'});
    }
    io.emit('message', message);
    return callback({message : 'Message Delivered'});
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left');
  });
});



server.listen(8000, () => {
  console.log('Server Run in port 8000');
});