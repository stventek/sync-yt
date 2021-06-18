import http from "http";
import socketio from 'socket.io';
import Room from './model/room';

type sendRoom = (room: number) => void;

export default (server: http.Server) => {

    const io = new socketio.Server(server, {cors: {origin: '*'}});

    io.on('connection', (socket) => {
        console.log(`socket ${socket.id} connected`);

        socket.on('create-room', (sendRoom: sendRoom | undefined) => {
            if(!sendRoom) return socket.disconnect();
            const room = Math.floor(Math.random() * 10**6);
            Room.create({room});
            sendRoom(room);
            console.log(Room.rooms);
        })
    })
};
