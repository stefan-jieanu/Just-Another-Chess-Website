const express = require('express');
const path = require('path');

const app = express();

const io = require('socket.io')(3000);


app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    socket.emit('msg', 'Hello World');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server started on port ${PORT}'));