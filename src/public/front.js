const socket = io('http://localhost:3000');

socket.on('msg', data => {
    console.log(data);
});
 