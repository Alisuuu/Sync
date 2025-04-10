const socket = io();
const chatInput = document.getElementById('chat-input');
const messages = document.getElementById('messages');
const videoFrame = document.getElementById('video-frame');
const videoUrlInput = document.getElementById('video-url');
const loadVideoBtn = document.getElementById('load-video');

loadVideoBtn.onclick = () => {
  const url = videoUrlInput.value;
  socket.emit('video change', url);
  updateVideo(url);
};

socket.on('video change', updateVideo);

function updateVideo(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    videoFrame.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
  } else if (url.includes('twitch.tv')) {
    const channel = url.split('/').pop();
    videoFrame.src = `https://player.twitch.tv/?channel=${channel}&parent=${location.hostname}`;
  } else {
    videoFrame.src = url;
  }
}

chatInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    socket.emit('chat message', chatInput.value);
    chatInput.value = '';
  }
});

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});