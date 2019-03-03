const socket = io();
socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#send').addEventListener('click', () => {
  socket.emit('message', document.getElementById('message').value);
});


