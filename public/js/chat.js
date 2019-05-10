const socket = io();

const $messages = document.querySelector('#messages');


const messageTemplate = document.querySelector('#message-template').innerHTML;
const messageTemplateLocation = document.querySelector('#message-template-location').innerHTML;

const {username , room } = Qs.parse(location.search, { ignoreQueryPrefix : true});
socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('D MMMM YYYY hh:mm:ss')
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplateLocation, {
    username: message.username,
    locationMessage: 'My Current Location',
    locationUrl: message.text,
    createdAt: moment(message.createdAt).format('D MMMM YYYY hh:mm:ss')
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault()

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', {username, message}, (result) => {
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


socket.emit('join', {username, room});