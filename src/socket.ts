import http from "http";
import socketio from 'socket.io';

export default (server: http.Server) => {

    const io = new socketio.Server(server, {cors: {origin: '*'}});

    io.on('connection', (socket) => {
        console.log(`socket ${socket.id} connected`);
    })
};
