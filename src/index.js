const express = require('express');
const path = require('path');

const app = express();

const io = require('socket.io')(process.env.POR);

let connections = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/game')));

// This is only teporary
let i = 0;
let emitNew = false;
let emitData;
let emitConn;

io.on('connection', socket => {
    connections.push(socket);
    if (i % 2 == 1) {
        socket.emit('change-side-to-black', '');
        console.log('switching');
    } else {
        console.log('not switching');
    }
    socket.on('piece-moved-server', data => {
        socket.broadcast.emit('piece-moved-client', data);
    });
    i += 1;
});


io.on('disconnect', socket => {
    let index = connections.indexOf(socket);
    if (index > -1)
        connections.splice(index, 1);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server started on port ${PORT}'));