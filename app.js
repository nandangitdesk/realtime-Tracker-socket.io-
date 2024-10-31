const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');



const server = http.createServer(app);
const io = new Server(server); 
app.set('view engine', 'ejs');
app.use('/public',express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.on("sendLocation", (data) => {
        io.emit("receiveLocation", {id:socket.id, ...data});
    });
    console.log('a user connected');
    socket.on('disconnect', () => {
        io.emit('user-disconnected', socket.id);
    });
   
});


app.get('/', (req, res) => {
    res.render('index.ejs');
});

server.listen(port, () => {
    console.log(` app is running on http://localhost:${port}`);
})