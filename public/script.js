const socket = new WebSocket('wss://your-app-name.onrender.com'); // Replace with your app URL

// Play Video Function
function playVideo(videoUrl) {
    const videoElement = document.getElementById('video');
    videoElement.src = videoUrl;
    videoElement.play();
}

// Send Chat Message
document.getElementById('sendMessage').addEventListener('click', () => {
    const message = document.getElementById('chat').value;
    if (message) {
        socket.send(JSON.stringify({ action: 'sendMessage', message }));
        document.getElementById('chat').value = ''; // Clear input
    }
});

// Handle WebSocket Messages
socket.onopen = () => {
    console.log('Connected to WebSocket server!');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.action === 'startVideo') {
        playVideo(data.videoUrl);
    } else if (data.action === 'receiveMessage') {
        const messageElement = document.createElement('div');
        messageElement.textContent = data.message;
        document.getElementById('messages').appendChild(messageElement);
    }
};

// Button to Start Video
document.getElementById('playButton').addEventListener('click', () => {
    const videoUrl = 'https://www.example.com/video.mp4'; // Replace with actual video URL
    socket.send(JSON.stringify({ action: 'startVideo', videoUrl }));
});
