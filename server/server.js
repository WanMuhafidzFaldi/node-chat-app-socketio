const path = require('path');
const express = require('express');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const socketio = require('socket.io');
const badWords = require('bad-words');
const utilsMessage = require('../src/utils/messages');
const users = require('../src/utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(publicPath));



io.on('connection', (socket) => {
  console.log('New WebSocket Connection');

  socket.on('join', ({username, room}, callback) => {
    const newUser = {
      id: socket.id,
      username: username,
      room: room
    }
    const {error, user} = users.addUser(newUser);
    if (error) {
      return callback(error);
    }

    socket.join(room);
    socket.emit('message', utilsMessage.generateMessage(user, 'Selamat Datang'));
    socket.broadcast.to(room).emit('message', utilsMessage.generateMessage(user, 'Masuk Di Chat Room'));
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = users.getUser(socket.id);
    const filter = new badWords();
    if(filter.isProfane(message)){
      return callback({err : true, text : 'Your Words Not Allowed'});
    }
    io.to(user.room).emit('message', utilsMessage.generateMessage(message.username, message.message));
    return callback({message : 'Message Delivered'});
  });

  socket.on('sendLocation', (coords, callback) => {
    const user = users.getUser(socket.id);
    io.to(user.room).emit('locationMessage',  utilsMessage.generateMessage(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
    return callback({message : 'Message Delivered'});
  });

  

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', utilsMessage.generateMessage(user.username,' Keluar Dari Chat'));
    }
  });
});



server.listen(8000, () => {
  console.log('Server Run in port 8000');
});