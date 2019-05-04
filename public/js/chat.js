const socket = io();
socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message
  });
  $messages.insertAdjacentHTML('beforebegin', html);
});

socket.on('locationMessage', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    locationMessage: 'My Current Location',
    locationUrl: message
  });
  $messages.insertAdjacentHTML('beforebegin', html);
});

const $messages = document.querySelector('#messages');


const messageTemplate = document.querySelector('#message-template').innerHTML;

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault()

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (result) => {
    if(result.err){
      return console.log(result.message);
    }
    return console.log(result.message);
  });
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation Not supported in your browser')
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      latitude  : position.coords.latitude,
      longitude : position.coords.longitude
    };
    socket.emit('sendLocation',location, (result) => {
      if(result.err){
        return console.log(result.message);
      }
      return console.log(result.message);
    });
  });
});

