const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require ('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin : "http://localhost:5173", //React+vite default port
        methods : ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected : ${socket.id}`);

    socket.on('send_message', (data)=>{
        socket.broadcast.emit("receive_message", data); // send to everyone
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

server.listen(3001, ()=>{
    console.log('Server is running on https://localhost:3001');
})