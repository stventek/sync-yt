import http from "http";
import socketio from 'socket.io';
import Room, {RoomDocument} from './model/room';

type sendRoom = (room: number) => void;
type sendStatus = (status: number) => void;

export default (server: http.Server) => {

    const io = new socketio.Server(server, {cors: {origin: '*'}});

    io.on('connection', (socket) => {
        console.log(`socket ${socket.id} connected`);

        socket.on('create-room', (sendRoom: sendRoom | undefined) => {
            if(!sendRoom) return socket.disconnect();
            const room = Math.floor(Math.random() * 10**6);
            Room.create(new RoomDocument(room));
            sendRoom(room);
        });

        socket.on('join-room', (username: string | undefined, room: number | undefined, sendStatus: sendStatus | undefined) => {
            if(!(username && room && sendStatus)) return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument){
                roomDocument.joinUser(username);
                return sendStatus(1);
            }
            sendStatus(0);
        })
    })
};
