const socket = io();

// Receive messages from users
socket.on('userMessage', (data) => {
    const messageList = document.getElementById('messageList');
    const listItem = document.createElement('li');
    listItem.textContent = `Message from ${data.username}: ${data.msg}`;
    messageList.appendChild(listItem);
});
