const videoLinkInput = document.getElementById('videoLink');
const loadVideoBtn = document.getElementById('loadVideoBtn');
const videoPlayer = document.getElementById('videoPlayer');
const messageInput = document.getElementById('messageInput');
const messagesList = document.getElementById('messages');

// Conectar ao WebSocket
const socket = new WebSocket('ws://localhost:8080'); // Ajuste para o endereço do seu servidor

socket.onopen = () => {
    console.log('Conectado ao servidor WebSocket');
};

// Receber mensagens do servidor (comandos para controlar o vídeo)
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'loadVideo') {
        videoPlayer.src = data.videoUrl;
    } else if (data.type === 'syncPlayPause') {
        if (data.play) {
            videoPlayer.contentWindow.postMessage('{"event":"command","func":"playVideo"}', '*');
        } else {
            videoPlayer.contentWindow.postMessage('{"event":"command","func":"pauseVideo"}', '*');
        }
    } else if (data.type === 'chatMessage') {
        const li = document.createElement('li');
        li.textContent = data.message;
        messagesList.appendChild(li);
    }
};

// Enviar o link do vídeo para todos
loadVideoBtn.addEventListener('click', () => {
    const videoUrl = videoLinkInput.value;
    socket.send(JSON.stringify({
        type: 'loadVideo',
        videoUrl: videoUrl
    }));
});

// Enviar comando de play/pause
function sendPlayPause(play) {
    socket.send(JSON.stringify({
        type: 'syncPlayPause',
        play: play
    }));
}

// Detecção de play/pause do vídeo
videoPlayer.addEventListener('play', () => {
    sendPlayPause(true);
});

videoPlayer.addEventListener('pause', () => {
    sendPlayPause(false);
});

// Enviar mensagem de chat
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && messageInput.value.trim()) {
        const message = messageInput.value.trim();
        socket.send(JSON.stringify({
            type: 'chatMessage',
            message: message
        }));
        messageInput.value = '';
    }
});
