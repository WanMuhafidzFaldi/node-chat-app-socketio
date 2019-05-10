const path = require('path');
const express = require('express');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const socketio = require('socket.io');
const badWords = require('bad-words');
const utilsMessage = require('../src/utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(publicPath));



io.on('connection', (socket) => {
  console.log('New WebSocket Connection');

  socket.on('join', ({username, room}) => {
    socket.join(room);
    socket.emit('message', utilsMessage.generateMessage(username, 'Selamat Datang'));
    socket.broadcast.to(room).emit('message', utilsMessage.generateMessage(username, 'Masuk Di Chat Room'));
    
    socket.on('sendMessage', (message, callback) => {
      const filter = new badWords();
      if(filter.isProfane(message)){
        return callback({err : true, text : 'Your Words Not Allowed'});
      }
      io.to(room).emit('message', utilsMessage.generateMessage(message.username, message.message));
      return callback({message : 'Message Delivered'});
    });
  
  });

  socket.on('sendLocation', (coords, callback) => {
    io.emit('locationMessage',  utilsMessage.generateMessage(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
    return callback({message : 'Message Delivered'});
  });

  

  socket.on('disconnect', () => {
    io.emit('message', utilsMessage.generateMessage('null','One User Disconnect'));
  });
});



server.listen(8000, () => {
  console.log('Server Run in port 8000');
});