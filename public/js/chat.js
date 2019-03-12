const socket = io();
socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#send').addEventListener('click', () => {
  socket.emit('message', document.getElementById('message').value);
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation Not supported in your browser')
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude  : position.coords.latitude,
      longitude : position.coords.longitude
    });
  });
});

