const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const users = {};  // To store connected users and their IDs
const messages = {};  // To store messages for each user

io.on('connection', (socket) => {
    console.log('User connected');

    // Register user and store their ID and data
    socket.on('register', (username) => {
        users[socket.id] = { username }; // Store username and ID
        messages[socket.id] = messages[socket.id] || [];  // Create message list if it doesn't exist
        console.log(`New user registered: ${username}`);
        
        // Update user list for admin
        io.emit('userListUpdate', Object.keys(users).map(id => ({ id, username: users[id].username })));

        // Send previous messages to the user upon connection
        socket.emit('previousMessages', messages[socket.id]);
    });

    // Receive message from users, store it, and send it to the admin
    socket.on('message', (msg) => {
        const username = users[socket.id].username;
        const timestamp = new Date().toLocaleString();
        const userMessage = { username, msg, timestamp };
        
        // Store message for the user
        if (!messages[socket.id]) {
            messages[socket.id] = [];
        }
        messages[socket.id].push(userMessage);
        
        // Send message to the admin
        io.emit('adminMessage', { id: socket.id, ...userMessage });
    });

    // Receive message from admin and send it to a specific user
    socket.on('adminToUser', ({ userId, message }) => {
        if (users[userId]) {
            io.to(userId).emit('message', { from: 'Ask The Boot', message });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User ${users[socket.id].username} disconnected`);
        delete users[socket.id];
        // Update user list for admin
        io.emit('userListUpdate', Object.keys(users).map(id => ({ id, username: users[id].username })));
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
