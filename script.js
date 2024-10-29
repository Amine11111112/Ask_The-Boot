const socket = io();

// Control the page transition
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send the username to the server for registration
    socket.emit('register', username);

    // Move to chat interface
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('chat-page').style.display = 'flex';
});

// Handle sending messages in chat interface
document.getElementById('send-button').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText !== '') {
        // Create a new message
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        newMessage.innerHTML = `<p>${messageText}</p>`;

        // Add message to chat box
        document.getElementById('chat-box').appendChild(newMessage);

        // Clear input field after sending
        messageInput.value = '';

        // Scroll to the bottom to see new message
        document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;

        // Send message to server
        socket.emit('message', messageText);
    }
});

// Receive previous messages when loading chat interface
socket.on('previousMessages', (messages) => {
    const chatBox = document.getElementById('chat-box');
    messages.forEach((msg) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<p><strong>${msg.username}</strong>: ${msg.message}</p>`;
        chatBox.appendChild(messageElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll down
});

// Receive messages from admin
socket.on('message', (data) => {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'from-bot');
    messageElement.innerHTML = `<p><strong>${data.from}</strong>: ${data.message}</p>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll down
});
